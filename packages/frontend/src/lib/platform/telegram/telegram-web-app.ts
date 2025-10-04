export const getWebApp = () => {
  return window.Telegram.WebApp;
};

export function getWebAppOrNull() {
  const webApp = window.Telegram?.WebApp;
  if (webApp && webApp.platform !== "unknown") return webApp;
  return null;
}
