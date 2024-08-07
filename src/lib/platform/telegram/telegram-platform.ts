import WebApp from "@twa-dev/sdk";
import { Platform, PlatformTheme } from "../platform.ts";
import { cssVarToValue } from "./css-var-to-value.ts";
import { Language } from "../../../translations/t.ts";
import { isRuProxy } from "../../urls/is-ru-proxy.ts";
import { PlatformSchemaType } from "../../../../functions/db/user/upsert-user-db.ts";

const buttonColor = "var(--tg-theme-button-color)";
const buttonTextColor = "var(--tg-theme-button-text-color)";
const hintColor = "var(--tg-theme-hint-color)";

export class TelegramPlatform implements Platform {
  getInitData(): string {
    return WebApp.initData;
  }

  getTheme(): PlatformTheme {
    return {
      buttonColor: cssVarToValue(buttonColor),
      hintColor: cssVarToValue(hintColor),
      buttonTextColor: cssVarToValue(buttonTextColor),
    };
  }

  getStartParam(): string | undefined {
    return WebApp.initDataUnsafe.start_param;
  }

  initialize() {
    WebApp.ready();
    WebApp.setHeaderColor("secondary_bg_color");
    if (this.isSwipeControllable()) {
      // @ts-expect-error
      WebApp.isVerticalSwipesEnabled = false;
    }
    WebApp.expand();
  }

  isOutdated(): boolean {
    return !WebApp.isVersionAtLeast("6.1");
  }

  isCloudStorageAvailable(): boolean {
    return WebApp.isVersionAtLeast("6.9");
  }

  isSwipeControllable() {
    return WebApp.isVersionAtLeast("7.8");
  }

  openInternalLink(link: string) {
    WebApp.openTelegramLink(link);
  }

  isIos() {
    return WebApp.platform === "ios";
  }

  isAndroid() {
    return WebApp.platform === "android";
  }

  isMacosWithShareBugs() {
    return WebApp.platform === "macos" && WebApp.isVersionAtLeast("7.8");
  }

  getClientData(): PlatformSchemaType {
    return {
      platform: WebApp.platform,
      colorScheme: WebApp.colorScheme,
      tgVersion: WebApp.version,
      isRuProxy: isRuProxy(),
    };
  }

  getLanguage(): Language {
    const languageCode = WebApp.initDataUnsafe.user?.language_code;
    switch (languageCode) {
      case "ru":
      case "es":
      case "pt-br":
        return languageCode;
      default:
        return "en";
    }
  }

  isTelegramDesktop() {
    return WebApp.platform === "tdesktop";
  }

  openExternalLink(link: string) {
    WebApp.openLink(link);
  }

  openInvoiceLink(link: string) {
    WebApp.openInvoice(link, (status) => {
      if (status === "paid") {
        WebApp.close();
      }
    });
  }
}
