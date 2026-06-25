import { Platform, PlatformTheme, HapticType } from "../platform.ts";
import {
  cssVariablesDark,
  cssVariablesLight,
} from "../browser/browser-colors.ts";
import { PlatformSchemaType } from "api";
import { makeObservable, observable, action } from "mobx";
import { LanguageShared } from "api";
import { getWebApp } from "./telegram-web-app.ts";
import { cloudStorageAdapter } from "./cloud-storage.ts";
import { lockOrientationWhenPortrait } from "./lock-orientation-when-portrait.ts";
import { applyColorScheme } from "../../color-scheme/apply-color-scheme.ts";

const LANGUAGE_CACHE_KEY = "languageCached";
const appBackgroundColorVariable = "--tg-theme-secondary-bg-color";

export class TelegramPlatform implements Platform {
  isFullScreen = this.calcIsFullScreen();
  languageCached: LanguageShared | null = null;

  constructor() {
    makeObservable(this, {
      isFullScreen: observable,
      languageCached: observable,
    });

    if (!this.isCloudStorageAvailable()) {
      return;
    }

    // Here we already know we're inside the Telegram platform
    // We use cloud storage to cache language so we know it before we load user preferences
    // TS error is because mobx-persist-store StorageController can return different types but we know it's a Promise
    // @ts-expect-error
    // prettier-ignore
    cloudStorageAdapter.getItem<LanguageShared>(LANGUAGE_CACHE_KEY)?.then((languageCached) => {
      if (!languageCached) {
        return;
      }
      this.languageCached = languageCached;
    });
  }

  getInitData(): string {
    return getWebApp().initData;
  }

  private getCssVariables() {
    return getWebApp().colorScheme === "dark"
      ? cssVariablesDark
      : cssVariablesLight;
  }

  private applyTheme() {
    const webApp = getWebApp();

    applyColorScheme(webApp.colorScheme);

    const cssVariables = this.getCssVariables();
    for (const variable in cssVariables) {
      document.documentElement.style.setProperty(
        variable,
        // @ts-ignore
        cssVariables[variable],
      );
    }

    if (webApp.colorScheme === "dark") {
      webApp.setHeaderColor(cssVariables[appBackgroundColorVariable]);
    } else {
      webApp.setHeaderColor("secondary_bg_color");
    }
  }

  getTheme(): PlatformTheme {
    const cssVariables = this.getCssVariables();
    return {
      buttonColor: cssVariables["--tg-theme-button-color"],
      hintColor: cssVariables["--tg-theme-hint-color"],
      buttonTextColor: cssVariables["--tg-theme-button-text-color"],
    };
  }

  getStartParam(): string | undefined {
    const startParam = getWebApp().initDataUnsafe.start_param;
    if (startParam) return startParam;

    const urlParams = new URLSearchParams(window.location.search);
    const start = urlParams.get("start");
    return typeof start === "string" ? start : undefined;
  }

  initialize() {
    this.applyTheme();

    getWebApp().ready();
    if (this.isSwipeControllable()) {
      getWebApp().isVerticalSwipesEnabled = false;
    }
    getWebApp().expand();
    this.requestFullscreen();
    lockOrientationWhenPortrait();

    // Def doesn't work on Mac :(
    // Don't know yet about other platform
    getWebApp().onEvent(
      "fullscreenChanged",
      action(() => {
        this.isFullScreen = this.calcIsFullScreen();
      }),
    );
    getWebApp().onEvent("themeChanged", () => {
      this.applyTheme();
    });
  }

  private calcIsFullScreen() {
    if (!getWebApp().isVersionAtLeast("8.0")) {
      return false;
    }
    if (getWebApp().platform === "macos") {
      return true;
    }
    return !!getWebApp().isFullscreen;
  }

  private requestFullscreen() {
    if (!getWebApp().isVersionAtLeast("8.0")) {
      return;
    }

    if (!this.isMobile()) {
      return;
    }

    getWebApp().requestFullscreen();
  }

  isOutdated(): boolean {
    return !getWebApp().isVersionAtLeast("6.1");
  }

  isCloudStorageAvailable(): boolean {
    return getWebApp().isVersionAtLeast("6.9");
  }

  isSwipeControllable() {
    return getWebApp().isVersionAtLeast("7.8");
  }

  openInternalLink(link: string) {
    // https://github.com/overtake/TelegramSwift/issues/1156
    if (this.isMacosWithShareBugs()) {
      this.openExternalLink(link);
      return;
    }

    getWebApp().openTelegramLink(link);
  }

  isIos() {
    return getWebApp().platform === "ios";
  }

  isWeb() {
    return (
      getWebApp().platform === "webk" ||
      getWebApp().platform === "weba" ||
      getWebApp().platform === "web"
    );
  }

  isAndroid() {
    return getWebApp().platform === "android";
  }

  isMobile() {
    return this.isIos() || this.isAndroid();
  }

  isMacosWithShareBugs() {
    return (
      getWebApp().platform === "macos" && getWebApp().isVersionAtLeast("7.8")
    );
  }

  getClientData(): PlatformSchemaType {
    return {
      platform: getWebApp().platform,
      colorScheme: getWebApp().colorScheme,
      tgVersion: getWebApp().version,
    };
  }

  setLanguageCached(language: LanguageShared) {
    this.languageCached = language;
    cloudStorageAdapter.setItem(LANGUAGE_CACHE_KEY, language);
  }

  getLanguageCached(): LanguageShared {
    if (this.languageCached) {
      return this.languageCached;
    }
    // If there's no cached language - use Telegram's language before we load user preferences

    const languageCode = getWebApp().initDataUnsafe.user?.language_code;
    switch (languageCode) {
      case "ru":
      case "es":
      case "pt-br":
      case "ar":
        return languageCode;
      default:
        return "en";
    }
  }

  openExternalLink(link: string) {
    getWebApp().openLink(link);
  }

  openInvoiceLink(link: string) {
    getWebApp().openInvoice(link, (status) => {
      if (status === "paid") {
        getWebApp().close();
      }
    });
  }

  hideKeyboard() {
    const webApp = getWebApp();
    if ("hideKeyboard" in webApp) {
      // @ts-ignore
      webApp.hideKeyboard();
    }
  }

  haptic(type: HapticType) {
    if (!this.isMobile()) return;

    switch (type) {
      case "error":
      case "success":
      case "warning":
        getWebApp().HapticFeedback.notificationOccurred(type);
        break;
      case "light":
      case "medium":
      case "heavy":
        getWebApp().HapticFeedback.impactOccurred(type);
        break;
      case "selection":
        getWebApp().HapticFeedback.selectionChanged();
        break;
      default:
        return type satisfies never;
    }
  }
}
