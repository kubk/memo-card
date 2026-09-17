import { action, makeAutoObservable, runInAction } from "mobx";
import { assert } from "api";
import { api } from "../../api/trpc-api.ts";
import { BrowserPlatform } from "../../lib/platform/browser/browser-platform.ts";
import { platform } from "../../lib/platform/platform.ts";
import { userStore } from "../../store/user-store.ts";

type TelegramAuthLib = {
  auth: (
    options: {
      client_id: number;
      scope: string[];
      nonce: string;
      lang: string;
    },
    callback: (result: { id_token?: string; error?: string }) => void,
  ) => void;
};

type TelegramLoginState =
  | { type: "initializing" }
  | { type: "initializationError" }
  | {
      type: "ready" | "signingIn" | "signInError";
      clientId: number;
      login: TelegramAuthLib;
    };

let telegramLibrary: Promise<TelegramAuthLib> | undefined;

function loadTelegramLogin() {
  telegramLibrary ??= new Promise<TelegramAuthLib>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://oauth.telegram.org/js/telegram-login.js?6";
    script.onload = () => {
      const telegram = window.Telegram as typeof window.Telegram & {
        Login: TelegramAuthLib;
      };
      resolve(telegram.Login);
    };
    script.onerror = () => {
      script.remove();
      telegramLibrary = undefined;
      reject(new Error("Telegram Login unavailable"));
    };
    document.head.appendChild(script);
  });
  return telegramLibrary;
}

export class LoginFormStore {
  isGoogleLoading = false;
  private telegramState: TelegramLoginState = { type: "initializing" };

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    this.initializeTelegram();
  }

  get isTelegramLoading() {
    return (
      this.telegramState.type === "initializing" ||
      this.telegramState.type === "signingIn"
    );
  }

  get hasTelegramError() {
    return (
      this.telegramState.type === "initializationError" ||
      this.telegramState.type === "signInError"
    );
  }

  signInWithGoogle() {
    this.isGoogleLoading = true;
  }

  handleGoogleCredential({ credential }: { credential: string }) {
    assert(platform instanceof BrowserPlatform);
    platform.handleGoogleAuth(credential);
  }

  private async initializeTelegram() {
    this.telegramState = { type: "initializing" };
    try {
      const [config, login] = await Promise.all([
        api.telegramSigninConfig.query(),
        loadTelegramLogin(),
      ]);
      if (!config.clientId) throw new Error("Telegram Login unavailable");
      runInAction(() => {
        this.telegramState = {
          type: "ready",
          clientId: Number(config.clientId),
          login,
        };
      });
    } catch {
      runInAction(() => {
        this.telegramState = { type: "initializationError" };
      });
    }
  }

  signInWithTelegram() {
    if (this.telegramState.type === "initializationError") {
      this.initializeTelegram();
      return;
    }
    if (
      this.telegramState.type !== "ready" &&
      this.telegramState.type !== "signInError"
    ) {
      return;
    }
    const nonce = crypto.randomUUID();
    this.telegramState.type = "signingIn";
    this.telegramState.login.auth(
      {
        client_id: this.telegramState.clientId,
        scope: ["profile", "write"],
        nonce,
        lang: userStore.language,
      },
      action((result) => {
        if (!result.id_token) {
          this.telegramState.type =
            result.error === "popup_closed" ? "ready" : "signInError";
          return;
        }
        assert(platform instanceof BrowserPlatform);
        platform.handleTelegramOidcLogin(result.id_token, nonce).catch(
          action(() => {
            this.telegramState.type = "signInError";
          }),
        );
      }),
    );
  }
}
