import { MotionProvider } from "./lib/framer-motion/motion-provider.tsx";
import { render } from "preact";
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
