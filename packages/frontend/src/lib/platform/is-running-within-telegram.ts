import { getWebApp } from "./telegram/telegram-web-app";

export const isRunningWithinTelegram = () => {
  if (!window.Telegram) {
    return false;
  }
  return getWebApp().platform !== "unknown";
};
