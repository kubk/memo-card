import { useBackButtonBrowser } from "./browser/use-back-button-browser.ts";
import { useBackButtonTelegram } from "./telegram/use-back-button-telegram.tsx";
import { platform } from "./platform.ts";
import { TelegramPlatform } from "./telegram/telegram-platform.ts";

export const useBackButton =
  platform instanceof TelegramPlatform
    ? useBackButtonTelegram
    : useBackButtonBrowser;
