import { useState } from "react";
import { observer } from "mobx-react-lite";
import { screenStore } from "../../store/screen-store.ts";
import { useBackButton } from "../../lib/platform/use-back-button.ts";
import { SpeechTest } from "./speech-test.tsx";

type DebugScreen = "menu" | "speechTest";

export const Debug = observer(() => {
  const [currentScreen, setCurrentScreen] = useState<DebugScreen>("menu");

  useBackButton(() => {
    if (currentScreen === "menu") {
      screenStore.back();
    } else {
      setCurrentScreen("menu");
    }
  });

  if (currentScreen === "speechTest") {
    return <SpeechTest />;
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold text-text">Debug Menu</h1>

      <button
        onClick={() => setCurrentScreen("speechTest")}
        className="py-3.5 px-4 bg-button text-button-text font-semibold rounded-xl active:scale-95 transition-all duration-200 text-left"
      >
        Speech Synthesis Test
      </button>
    </div>
  );
});
