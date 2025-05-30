import { platform } from "./platform.ts";
import { TelegramPlatform } from "./telegram/telegram-platform.ts";
import { showConfirmTelegram } from "./telegram/show-confirm-telegram.ts";
import { showConfirmBrowser } from "./browser/show-confirm-browser.tsx";

export const showConfirm =
  platform instanceof TelegramPlatform && !platform.isMacosWithShareBugs()
    ? showConfirmTelegram
    : showConfirmBrowser;
