import { getWebApp } from "./telegram/telegram-web-app";

export const isRunningWithinTelegram = () => {
  return getWebApp().platform !== "unknown";
};
