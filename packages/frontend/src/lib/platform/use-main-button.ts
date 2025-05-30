import { platform } from "./platform.ts";
import { useMainButtonTelegram } from "./telegram/use-main-button-telegram.ts";
import { useMainButtonBrowser } from "./browser/use-main-button-browser.ts";
import { TelegramPlatform } from "./telegram/telegram-platform.ts";

export const useMainButton =
  platform instanceof TelegramPlatform
    ? useMainButtonTelegram
    : useMainButtonBrowser;
