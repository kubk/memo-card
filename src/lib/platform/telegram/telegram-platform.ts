import WebApp from "@twa-dev/sdk";
import { Platform, PlatformTheme } from "../platform.ts";
import { cssVarToValue } from "./css-var-to-value.ts";

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

  openExternalLink(link: string) {
    WebApp.openLink(link);
  }
}
