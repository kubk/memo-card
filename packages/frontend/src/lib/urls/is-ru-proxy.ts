import { links } from "api";

export const isRuProxy = () => {
  return window.location.host === links.appBrowserRuProxyHost;
};
