import { MotionProvider } from "./lib/framer-motion/motion-provider.tsx";
import { render } from "preact";
import "./index.css";
import { initializePlatform } from "./lib/platform/platform.ts";
import { reportHandledError } from "./lib/rollbar/rollbar.tsx";
import { polyfillCountryFlagEmojis } from "country-flag-emoji-polyfill";
import { translationResourceStore } from "./translations/t.ts";

// iOS WebKit needs a touch listener to apply CSS :active while pressing.
document.addEventListener("touchstart", () => {}, { passive: true });

// https://vitejs.dev/guide/build#load-error-handling
window.addEventListener("vite:preloadError", () => {
  window.location.reload();
});

const translationPromise = translationResourceStore.initialize();
const appPromise = import("./screens/app.tsx");

polyfillCountryFlagEmojis();
initializePlatform();

Promise.all([translationPromise, appPromise])
  .then(([, { App }]) => {
    render(
      <MotionProvider>
        <App />
      </MotionProvider>,
      document.getElementById("root")!,
    );
  })
  .catch((error) => {
    reportHandledError("Failed to initialize frontend", error);
  });
