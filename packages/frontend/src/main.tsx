import ReactDOM from "react-dom/client";
import "./index.css";
import { platform } from "./lib/platform/platform.ts";
import { reportHandledError } from "./lib/rollbar/rollbar.tsx";
import { polyfillCountryFlagEmojis } from "country-flag-emoji-polyfill";
import { translationResourceStore } from "./translations/t.ts";

// https://vitejs.dev/guide/build#load-error-handling
window.addEventListener("vite:preloadError", () => {
  window.location.reload();
});

const translationPromise = translationResourceStore.initialize();
const appPromise = import("./screens/app.tsx");

polyfillCountryFlagEmojis();
platform.initialize();

Promise.all([translationPromise, appPromise])
  .then(([, { App }]) => {
    ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
  })
  .catch((error) => {
    reportHandledError("Failed to initialize frontend", error);
  });
