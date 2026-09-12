import { action, makeAutoObservable, runInAction } from "mobx";
import { assert } from "api";
import { api } from "../../api/trpc-api.ts";
import { BrowserPlatform } from "../../lib/platform/browser/browser-platform.ts";
import { platform } from "../../lib/platform/platform.ts";

type TelegramLogin = {
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

let library: Promise<TelegramLogin> | undefined;

function loadTelegramLogin() {
  library ??= new Promise<TelegramLogin>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://oauth.telegram.org/js/telegram-login.js?6";
    script.onload = () => {
      const telegram = window.Telegram as typeof window.Telegram & {
        Login: TelegramLogin;
      };
      resolve(telegram.Login);
    };
    script.onerror = () => {
      script.remove();
      library = undefined;
      reject(new Error("Telegram Login unavailable"));
    };
    document.head.appendChild(script);
  });
  return library;
}

export class TelegramLoginStore {
  isLoading = true;
  hasError = false;
  private clientId: number | undefined;
  private login: TelegramLogin | undefined;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    this.initialize();
  }

  async initialize() {
    this.isLoading = true;
    this.hasError = false;
    try {
      const [config, login] = await Promise.all([
        api.telegramSigninConfig.query(),
        loadTelegramLogin(),
      ]);
      if (!config.clientId) throw new Error("Telegram Login unavailable");
      runInAction(() => {
        this.clientId = Number(config.clientId);
        this.login = login;
      });
    } catch {
      runInAction(() => {
        this.hasError = true;
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  signIn() {
    if (!this.login || !this.clientId) {
      this.initialize();
      return;
    }
    const nonce = crypto.randomUUID();
    this.hasError = false;
    this.login.auth(
      {
        client_id: this.clientId,
        scope: ["profile", "write"],
        nonce,
        lang: platform.getLanguageCached(),
      },
      action((result) => {
        if (!result.id_token) {
          this.hasError = result.error !== "popup_closed";
          return;
        }
        assert(platform instanceof BrowserPlatform);
        this.isLoading = true;
        platform.handleTelegramOidcLogin(result.id_token, nonce).catch(
          action(() => {
            this.isLoading = false;
            this.hasError = true;
          }),
        );
      }),
    );
  }
}
