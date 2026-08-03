import ReactDOM from "react-dom/client";
import "./playground.css";
import { platform } from "../src/lib/platform/platform.ts";
import { translationResourceStore } from "../src/translations/t.ts";

const translationPromise = translationResourceStore.initialize();
const playgroundPromise = import("./playground.tsx");

platform.initialize();

Promise.all([translationPromise, playgroundPromise])
  .then(([, { Playground }]) => {
    ReactDOM.createRoot(document.getElementById("root")!).render(
      <Playground />,
    );
  })
  .catch(console.error);
