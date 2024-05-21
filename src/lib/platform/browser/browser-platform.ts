import { Platform, PlatformTheme } from "../platform.ts";
import { makeAutoObservable } from "mobx";
import { assert } from "../../typescript/assert.ts";
import { BooleanToggle } from "mobx-form-lite";
import { PlatformSchemaType } from "../../../../functions/services/get-telegram-user.ts";
import { Language } from "../../../translations/t.ts";

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

export class BrowserPlatform implements Platform {
  mainButtonInfo?: {
    text: string;
    onClick: () => void;
    condition?: () => boolean;
  };
  isMainButtonLoading = new BooleanToggle(false);
  backButtonInfo?: {
    onClick: () => void;
  };

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
  }

  getTheme(): PlatformTheme {
    return {
      buttonColor: cssVariables["--tg-theme-button-color"],
      hintColor: cssVariables["--tg-theme-hint-color"],
      buttonTextColor: cssVariables["--tg-theme-button-text-color"],
    };
  }

  getLanguage(): Language {
    return "en";
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

  getInitData(): string {
    const userQuery = import.meta.env.VITE_USER_QUERY;
    assert(typeof userQuery === "string", "VITE_USER_QUERY is not defined");
    return userQuery;
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
}
