const appBotUrl = import.meta.env.VITE_BOT_APP_URL;
const stage = import.meta.env.VITE_STAGE;
const apiBaseUrl = import.meta.env.VITE_API_URL || "";

if (!appBotUrl) {
  throw new Error("VITE_BOT_APP_URL is not set");
}

if (!stage) {
  throw new Error("VITE_STAGE is not set");
}

export const envSafe = {
  appBotUrl,
  stage,
  apiBaseUrl,
};
