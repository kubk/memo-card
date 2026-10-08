import { MotionProvider } from "../src/lib/framer-motion/motion-provider.tsx";
import { render } from "preact";
import "./playground.css";
import { initializePlatform } from "../src/lib/platform/platform.ts";
import { translationResourceStore } from "../src/translations/t.ts";

const translationPromise = translationResourceStore.initialize();
const playgroundPromise = import("./playground.tsx");

initializePlatform();

Promise.all([translationPromise, playgroundPromise])
  .then(([, { Playground }]) => {
    render(
      <MotionProvider>
        <Playground />
      </MotionProvider>,
      document.getElementById("root")!,
    );
  })
  .catch(console.error);
