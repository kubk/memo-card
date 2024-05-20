import { isRuProxy } from "./is-ru-proxy.ts";

export const getBotUrl = () => {
  if (isRuProxy()) {
    return import.meta.env.VITE_BOT_APP_RU_URL;
  }
  return import.meta.env.VITE_BOT_APP_URL;
};
