import { Platform, platformMaxWidth, PlatformTheme } from "../platform.ts";
import { action, makeAutoObservable } from "mobx";
import { BooleanToggle } from "mobx-form-lite";
import { isLanguage, Language } from "../../../translations/t.ts";
import { PlatformSchemaType } from "../../../../functions/db/user/upsert-user-db.ts";
import { isDarkTheme } from "../../color-scheme/is-dark-theme.tsx";
import { googleSignInRequest } from "../../../api/api.ts";
import { UserSource } from "../../../../functions/db/user/user-source.ts";
import {
  browserPlatformLangKey,
  browserTokenKey,
} from "./local-storage-keys.ts";
import { cssVariablesDark, cssVariablesLight } from "./browser-colors.ts";

export class BrowserPlatform implements Platform {
  isMobile = false;

  mainButtonInfo?: {
    text: string;
    onClick: () => void;
    condition?: () => boolean;
  };
  isMainButtonLoading = new BooleanToggle(false);
  backButtonInfo?: {
    onClick: () => void;
  };

  dbLang?: string | null = localStorage.getItem(browserPlatformLangKey) || null;

  constructor() {
    makeAutoObservable(
      this,
      {
        getTheme: false,
        getInitData: false,
        initialize: false,
        openInternalLink: false,
        getStartParam: false,
        openExternalLink: false,
      },
      {
        autoBind: true,
      },
    );

    this.listenIsMobile();
  }

  private getCssVariables() {
    return isDarkTheme() ? cssVariablesDark : cssVariablesLight;
  }

  getTheme(): PlatformTheme {
    const cssVariables = this.getCssVariables();
    return {
      buttonColor: cssVariables["--tg-theme-button-color"],
      hintColor: cssVariables["--tg-theme-hint-color"],
      buttonTextColor: cssVariables["--tg-theme-button-text-color"],
    };
  }

  getLanguage(): Language {
    return isLanguage(this.dbLang) ? this.dbLang : "en";
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
      colorScheme: isDarkTheme() ? "dark" : "light",
    };
  }

  showMainButton(text: string, onClick: () => void, condition?: () => boolean) {
    this.mainButtonInfo = {
      text,
      onClick,
      condition,
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
    const userQuery = import.meta.env.VITE_USER_QUERY;
    if (userQuery) {
      return userQuery;
    }

    return localStorage.getItem(browserTokenKey) || null;
  }

  // Telegram auth outside Telegram mini app
  handleTelegramWidgetLogin(data: Record<any, any>) {
    localStorage.setItem(
      browserTokenKey,
      `${UserSource.Telegram} ${JSON.stringify(data)}`,
    );
    window.location.reload();
  }

  // Google auth outside Telegram mini app
  handleGoogleAuth(credential: string) {
    googleSignInRequest({ token: credential })
      .then((response) => {
        localStorage.setItem(
          browserTokenKey,
          `${UserSource.Google} ${response.browserToken}`,
        );
        window.location.reload();
      })
      .catch(console.error);
  }

  initialize() {
    const cssVariables = this.getCssVariables();
    for (const variable in cssVariables) {
      document.documentElement.style.setProperty(
        variable,
        // @ts-ignore
        cssVariables[variable],
      );
    }

    // Temporarily prevent back button forcing user to use our own
    // Will be replaced when a routing library is integrated
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function () {
      window.history.pushState(null, "", window.location.href);
    };
  }

  openInternalLink(link: string) {
    window.location.href = link;
  }

  openExternalLink(link: string) {
    window.open(link, "_blank");
  }

  listenIsMobile() {
    const isMobileQuery = window.matchMedia(
      `(max-width: ${platformMaxWidth}px)`,
    );
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

  isWindows() {
    return navigator.platform.indexOf("Win") > -1;
  }

  setDbLang(lang?: string | null) {
    this.dbLang = lang;
    localStorage.setItem(browserPlatformLangKey, lang || "");
  }

  logout() {
    localStorage.removeItem(browserTokenKey);
    window.location.reload();
  }
}
