import { platform } from "./platform.ts";
import { TelegramPlatform } from "./telegram/telegram-platform.ts";
import { useMainButtonProgressTelegram } from "./telegram/use-main-button-progress-telegram.tsx";
import { useMainButtonProgressBrowser } from "./browser/use-main-button-progress-browser.ts";

export const useMainButtonProgress =
  platform instanceof TelegramPlatform
    ? useMainButtonProgressTelegram
    : useMainButtonProgressBrowser;
