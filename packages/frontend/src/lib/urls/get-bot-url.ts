import { isRuProxy } from "./is-ru-proxy.ts";
import { links } from "api";

export const getBotUrl = () => {
  if (isRuProxy()) {
    return links.botAppRuProxy;
  }
  return import.meta.env.VITE_BOT_APP_URL;
};
