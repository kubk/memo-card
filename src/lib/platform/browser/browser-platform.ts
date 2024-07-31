import { Platform, PlatformTheme } from "../platform.ts";
import { action, makeAutoObservable } from "mobx";
import { BooleanToggle } from "mobx-form-lite";
import { isLanguage, Language } from "../../../translations/t.ts";
import { PlatformSchemaType } from "../../../../functions/db/user/upsert-user-db.ts";

const cssVariables = {
  "--tg-theme-hint-color": "#999999",
  "--tg-theme-secondary-bg-color": "#efeff3",
  "--tg-theme-text-color": "#000000",
  "--tg-theme-section-bg-color": "#ffffff",
  "--tg-theme-header-bg-color": "#efeff3",
  "--tg-theme-accent-text-color": "#2481cc",
  "--tg-color-scheme": "light",
  "--tg-viewport-height": "100vh",
  "--tg-theme-destructive-text-color": "#ff3b30",
  "--tg-theme-button-color": "#2481cc",
  "--tg-theme-bg-color": "#ffffff",
  "--tg-theme-subtitle-text-color": "#999999",
  "--tg-theme-button-text-color": "#ffffff",
  "--tg-theme-section-header-text-color": "#6d6d71",
  "--tg-theme-link-color": "#2481cc",
  "--tg-viewport-stable-height": "100vh",
};

const telegramLoginWidgetDataKey = "tlg";
const browserPlatformLangKey = "browserPlatformLang";

export class BrowserPlatform implements Platform {
  maxWidth = 600;
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
        maxWidth: false,
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

  getTheme(): PlatformTheme {
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
    return {};
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
    const tlgLoginWidgetData = localStorage.getItem(telegramLoginWidgetDataKey);
    return tlgLoginWidgetData || null;
  }

  // Telegram auth outside Telegram mini app
  handleTelegramWidgetLogin(data: Record<any, any>) {
    localStorage.setItem(telegramLoginWidgetDataKey, JSON.stringify(data));
    window.location.reload();
  }

  initialize() {
    for (const variable in cssVariables) {
      document.documentElement.style.setProperty(
        variable,
        // @ts-ignore
        cssVariables[variable],
      );
    }
  }

  openInternalLink(link: string) {
    window.location.href = link;
  }

  openExternalLink(link: string) {
    window.open(link, "_blank");
  }

  listenIsMobile() {
    const isMobileQuery = window.matchMedia(`(max-width: ${this.maxWidth}px)`);
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
}
