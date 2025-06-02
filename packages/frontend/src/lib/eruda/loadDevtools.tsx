import { isRunningWithinTelegram } from "../platform/is-running-within-telegram";

// Load mini-app devtools
export function loadDevtools() {
  if (
    isRunningWithinTelegram() &&
    import.meta.env.VITE_STAGE !== "production"
  ) {
    // load it dynamically and append to the dom:
    const erudaScript = document.createElement("script");
    erudaScript.src = "https://cdn.jsdelivr.net/npm/eruda";
    erudaScript.onload = () => {
      // Initialize eruda after the script has loaded
      // @ts-ignore - eruda will be available globally but TS doesn't know about it
      window.eruda.init();
    };
    document.body.appendChild(erudaScript);
  }
}
