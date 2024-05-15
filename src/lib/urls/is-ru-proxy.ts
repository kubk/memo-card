export const isRuProxy = () => {
  return window.location.host === import.meta.env.VITE_RU_PROXY_HOST;
}
