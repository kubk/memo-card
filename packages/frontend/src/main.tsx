import ReactDOM from "react-dom/client";
import { App } from "./screens/app.tsx";
import "./index.css";
import { platform } from "./lib/platform/platform.ts";
import { erudaStore } from "./store/eruda-store.ts";
import { applyFormatters } from "mobx-log";
import { polyfillCountryFlagEmojis } from "country-flag-emoji-polyfill";
import { Settings } from "luxon";

polyfillCountryFlagEmojis();

applyFormatters();

platform.initialize();
erudaStore.load();

Settings.throwOnInvalid = false;

// https://vitejs.dev/guide/build#load-error-handling
window.addEventListener("vite:preloadError", () => {
  window.location.reload();
});

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
