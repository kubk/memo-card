import { getWebAppOrNull } from "./telegram/telegram-web-app";

export function isRunningWithinTelegram() {
  return !!getWebAppOrNull();
}
