import WebApp from "@twa-dev/sdk";

export const isRunningWithinTelegram = () => {
  return WebApp.platform !== "unknown";
};
