import { platform } from "./platform.ts";
import { TelegramPlatform } from "./telegram/telegram-platform.ts";
import { showAlertTelegram } from "./telegram/show-alert-telegram.ts";
import { showAlertBrowser } from "./browser/show-alert-browser.ts";

export const showAlert =
  platform instanceof TelegramPlatform ? showAlertTelegram : showAlertBrowser;
