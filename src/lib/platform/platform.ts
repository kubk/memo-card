import { TelegramPlatform } from "./telegram/telegram-platform.ts";
import { BrowserPlatform } from "./browser/browser-platform.ts";
import { isRunningWithinTelegram } from "./is-running-within-telegram.ts";

export type PlatformTheme = {
  buttonColor: string;
  hintColor: string;
  buttonTextColor: string;
};

export interface Platform {
  getInitData(): string;
  initialize(): void;
  openExternalLink(link: string): void;
  openInternalLink(link: string): void;
  getTheme(): PlatformTheme;
}

export type UseMainButtonType = (
  text: string | (() => string),
  onClick: () => void,
  condition?: () => boolean,
) => void;

export type ShowConfirmType = (text: string) => Promise<boolean>;

const createPlatform = (): Platform => {
  return isRunningWithinTelegram()
    ? new TelegramPlatform()
    : new BrowserPlatform();
};

export const platform = createPlatform();
