import { platform } from "./platform.ts";
import { TelegramPlatform } from "./telegram/telegram-platform.ts";
import { useProgressTelegram } from "./telegram/use-progress-telegram.tsx";
import { useProgressBrowser } from "./browser/use-progress-browser.ts";

export const useProgress =
  platform instanceof TelegramPlatform
    ? useProgressTelegram
    : useProgressBrowser;
