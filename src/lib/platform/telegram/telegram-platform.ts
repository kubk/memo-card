import WebApp from "@twa-dev/sdk";
import { Platform, PlatformTheme } from "../platform.ts";
import { cssVarToValue } from "./css-var-to-value.ts";
import { PlatformSchemaType } from "../../../../functions/services/get-user.ts";
import { Language } from "../../../translations/t.ts";

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
    WebApp.expand();
  }

  isOutdated(): boolean {
    return !WebApp.isVersionAtLeast("6.1");
  }

  isCloudStorageAvailable(): boolean {
    return WebApp.isVersionAtLeast("6.9");
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

  getClientData(): PlatformSchemaType {
    return {
      platform: WebApp.platform,
      colorScheme: WebApp.colorScheme,
      tgVersion: WebApp.version,
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
}
