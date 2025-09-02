import { Platform, PlatformTheme, HapticType } from "../platform.ts";
import { cssVarToValue } from "./css-var-to-value.ts";
import { PlatformSchemaType } from "api";
import { makeObservable, observable, action } from "mobx";
import { LanguageShared } from "api";
import { getWebApp } from "./telegram-web-app.ts";
import { cloudStorageAdapter } from "./cloud-storage.ts";

const buttonColor = "var(--tg-theme-button-color)";
const buttonTextColor = "var(--tg-theme-button-text-color)";
const hintColor = "var(--tg-theme-hint-color)";
const LANGUAGE_CACHE_KEY = "languageCached";

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

  getTheme(): PlatformTheme {
    return {
      buttonColor: cssVarToValue(buttonColor),
      hintColor: cssVarToValue(hintColor),
      buttonTextColor: cssVarToValue(buttonTextColor),
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
    getWebApp().ready();
    getWebApp().setHeaderColor("secondary_bg_color");
    if (this.isSwipeControllable()) {
      getWebApp().isVerticalSwipesEnabled = false;
    }
    getWebApp().expand();

    // Def doesn't work on Mac :(
    // Don't know yet about other platform
    getWebApp().onEvent(
      "fullscreenChanged",
      action(() => {
        this.isFullScreen = this.calcIsFullScreen();
      }),
    );
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

  isTelegramDesktop() {
    return getWebApp().platform === "tdesktop";
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
    const isMobile =
      getWebApp().platform === "ios" || getWebApp().platform === "android";
    if (!isMobile) return;

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
