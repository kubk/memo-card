import { Platform, PlatformTheme } from "../platform.ts";
import { cssVarToValue } from "./css-var-to-value.ts";
import { PlatformSchemaType } from "api";
import { makeObservable, observable, action } from "mobx";
import { LanguageShared } from "api";
import { getWebApp } from "./telegram-web-app.ts";

const buttonColor = "var(--tg-theme-button-color)";
const buttonTextColor = "var(--tg-theme-button-text-color)";
const hintColor = "var(--tg-theme-hint-color)";

export class TelegramPlatform implements Platform {
  isFullScreen = this.calcIsFullScreen();

  constructor() {
    makeObservable(this, {
      isFullScreen: observable,
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
      // @ts-expect-error
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
    // @ts-expect-error
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

  getLanguageCached(): LanguageShared {
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
}
