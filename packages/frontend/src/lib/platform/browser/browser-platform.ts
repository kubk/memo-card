import { Platform, HapticType } from "../platform.ts";
import type { WebHaptics, defaultPatterns } from "web-haptics";
import { action, makeAutoObservable } from "mobx";
import { BooleanToggle } from "mobx-form-lite";
import { localUserIdPrefix, PlatformSchemaType } from "api";
import {
  isDarkTheme,
  listenDarkThemeChange,
} from "../../color-scheme/is-dark-theme.tsx";
import { UserSource } from "api";
import {
  browserPlatformLangKey,
  browserTokenKey,
} from "./local-storage-keys.ts";
import { cssVariablesDark, cssVariablesLight } from "../../../ui/theme.tsx";
import { LanguageShared } from "api";
import { api } from "../../../api/trpc-api.ts";
import { applyColorScheme } from "../../color-scheme/apply-color-scheme.ts";
import { env } from "../../../env.ts";
import { normalizeLanguage } from "../../../translations/normalize-language.ts";

export class BrowserPlatform implements Platform {
  isMobile = false;

  mainButtonInfo?: {
    text: string;
    onClick: () => void;
    condition?: () => boolean;
    isAboveBottomSheet?: boolean;
  };
  isMainButtonLoading = new BooleanToggle(false);
  backButtonInfo?: {
    onClick: () => void;
  };

  languageCached = normalizeLanguage(
    localStorage.getItem(browserPlatformLangKey),
  );

  constructor() {
    makeAutoObservable<this, "webHaptics">(
      this,
      {
        getInitData: false,
        initialize: false,
        openInternalLink: false,
        getStartParam: false,
        openExternalLink: false,
        webHaptics: false,
      },
      {
        autoBind: true,
      },
    );

    this.listenIsMobile();
    this.loadWebHaptics();
  }

  private getCssVariables() {
    return isDarkTheme() ? cssVariablesDark : cssVariablesLight;
  }

  private applyTheme() {
    applyColorScheme(isDarkTheme() ? "dark" : "light");

    const cssVariables = this.getCssVariables();
    for (const variable in cssVariables) {
      document.documentElement.style.setProperty(
        variable,
        // @ts-ignore
        cssVariables[variable],
      );
    }
  }

  getStartParam(): string | undefined {
    const urlParams = new URLSearchParams(window.location.search);
    const start = urlParams.get("start");
    if (typeof start === "string") {
      return start;
    }
    return undefined;
  }

  getClientData(): PlatformSchemaType {
    return {
      platform: navigator.userAgent,
      userAgent: navigator.userAgent,
      colorScheme: isDarkTheme() ? "dark" : "light",
    };
  }

  getUserAvatarUrl(): string | null {
    return null;
  }

  showMainButton(
    text: string,
    onClick: () => void,
    condition?: () => boolean,
    isAboveBottomSheet?: boolean,
  ) {
    this.mainButtonInfo = {
      text,
      onClick,
      condition,
      isAboveBottomSheet,
    };
  }

  hideMainButton() {
    this.mainButtonInfo = undefined;
  }

  get isMainButtonVisible() {
    return this.mainButtonInfo !== undefined;
  }

  showBackButton(onClick: () => void) {
    this.backButtonInfo = {
      onClick,
    };
  }

  hideBackButton() {
    this.backButtonInfo = undefined;
  }

  get isBackButtonVisible() {
    return this.backButtonInfo !== undefined;
  }

  getInitData(): string | null {
    if (env.VITE_STAGE === "local" && env.VITE_USER_ID) {
      return `${localUserIdPrefix}${env.VITE_USER_ID}`;
    }

    return localStorage.getItem(browserTokenKey) || null;
  }

  handleTelegramOidcLogin(token: string, nonce: string) {
    return api.telegramSignin.mutate({ token, nonce }).then((response) => {
      localStorage.setItem(
        browserTokenKey,
        `${UserSource.Api} ${response.browserToken}`,
      );
      window.location.href = "/";
    });
  }

  // Google auth outside Telegram mini app
  handleGoogleAuth(credential: string) {
    api.googleSignin
      .mutate({ token: credential })
      .then((response) => {
        localStorage.setItem(
          browserTokenKey,
          `${UserSource.Google} ${response.browserToken}`,
        );
        window.location.href = "/";
      })
      .catch(console.error);
  }

  initialize() {
    this.applyTheme();
    listenDarkThemeChange(() => this.applyTheme());
  }

  openInternalLink(link: string) {
    window.location.href = link;
  }

  openExternalLink(link: string) {
    window.open(link, "_blank");
  }

  listenIsMobile() {
    if (!window.matchMedia) {
      return;
    }
    const isMobileQuery = window.matchMedia(`(max-width: 600px)`);
    this.isMobile = isMobileQuery.matches;
    isMobileQuery.addEventListener(
      "change",
      action((e) => {
        this.isMobile = e.matches;
      }),
    );
  }

  openInvoiceLink(link: string) {
    this.openExternalLink(link);
  }

  logout() {
    localStorage.removeItem(browserTokenKey);
    window.location.href = "/";
  }

  getLanguageCached(): LanguageShared {
    return this.languageCached;
  }

  setLanguageCached(language: LanguageShared) {
    this.languageCached = language;
    localStorage.setItem(browserPlatformLangKey, language);
  }

  private webHaptics?: {
    instance: WebHaptics;
    patterns: typeof defaultPatterns;
  };

  private loadWebHaptics() {
    import("web-haptics").then(({ WebHaptics, defaultPatterns }) => {
      this.webHaptics = {
        instance: new WebHaptics(),
        patterns: defaultPatterns,
      };
    });
  }

  haptic(type: HapticType) {
    if (!this.isMobile || !this.webHaptics) return;

    const { instance, patterns } = this.webHaptics;

    switch (type) {
      case "success":
        instance.trigger(patterns.success);
        break;
      case "warning":
        instance.trigger(patterns.warning);
        break;
      case "error":
        instance.trigger(patterns.error);
        break;
      case "light":
        instance.trigger(patterns.light);
        break;
      case "medium":
        instance.trigger(patterns.medium);
        break;
      case "heavy":
        instance.trigger(patterns.heavy);
        break;
      case "selection":
        instance.trigger(patterns.selection);
        break;
      default:
        return type satisfies never;
    }
  }
}
