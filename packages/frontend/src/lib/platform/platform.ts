import { TelegramPlatform } from "./telegram/telegram-platform.ts";
import { BrowserPlatform } from "./browser/browser-platform.ts";
import { isRunningWithinTelegram } from "./is-running-within-telegram.ts";
import { PlatformSchemaType } from "api";
import { LanguageShared } from "api";

export type HapticType =
  | "error"
  | "success"
  | "warning"
  | "light"
  | "medium"
  | "heavy"
  | "selection";

export type PlatformTheme = {
  buttonColor: string;
  hintColor: string;
  buttonTextColor: string;
};

export interface Platform {
  initialize(): void;
  getInitData(): string | null;
  openExternalLink(link: string): void;
  openInternalLink(link: string): void;
  getTheme(): PlatformTheme;
  getClientData(): PlatformSchemaType;
  getLanguageCached(): LanguageShared;
  setLanguageCached(language: LanguageShared): void;
  getStartParam(): string | undefined;
  openInvoiceLink(link: string): void;
  haptic(type: HapticType): void;
  getSafeAreaInset(): { top: number; bottom: number };
}

export type UseMainButtonType = (
  text: string | (() => string),
  onClick: () => void,
  condition?: () => boolean,
  deps?: any[],
  options?: { forceHide?: boolean; hasShineEffect?: boolean },
) => void;

export type UseBackButtonType = (onBack: () => void, deps?: any[]) => void;

export type ShowConfirmType = (text: string) => Promise<boolean>;

const createPlatform = (): Platform => {
  return isRunningWithinTelegram()
    ? new TelegramPlatform()
    : new BrowserPlatform();
};

export const platform = createPlatform();
