import { useState } from "react";
import { screenStore } from "../../store/screen-store.ts";
import { useBackButton } from "../../lib/platform/use-back-button.ts";
import { SpeechTest } from "./speech-test.tsx";
import { HapticsTest } from "./haptics-test.tsx";
import { SafeAreaTest } from "./safe-area-test.tsx";

type DebugScreen = "menu" | "speechTest" | "hapticsTest" | "safeAreaTest";

export function Debug() {
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

  if (currentScreen === "hapticsTest") {
    return <HapticsTest />;
  }

  if (currentScreen === "safeAreaTest") {
    return <SafeAreaTest />;
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

      <button
        onClick={() => setCurrentScreen("hapticsTest")}
        className="py-3.5 px-4 bg-button text-button-text font-semibold rounded-xl active:scale-95 transition-all duration-200 text-left"
      >
        Haptics Test
      </button>

      <button
        onClick={() => setCurrentScreen("safeAreaTest")}
        className="py-3.5 px-4 bg-button text-button-text font-semibold rounded-xl active:scale-95 transition-all duration-200 text-left"
      >
        Safe Area Test
      </button>

      <button
        onClick={() => {
          throw new Error("Test exception triggered from debug menu");
        }}
        className="py-3.5 px-4 bg-red-500 text-white font-semibold rounded-xl active:scale-95 transition-all duration-200 text-left"
      >
        Trigger Exception
      </button>
    </div>
  );
}
