import { observer } from "mobx-react-lite";
import { useAiMassCreationStore } from "./store/ai-mass-creation-store-provider.tsx";
import React from "react";
import { AiMassCreationForm } from "./ai-mass-creation-form.tsx";
import { HowMassCreationWorksScreen } from "./how-mass-creation-works-screen.tsx";
import { PreviousPromptsScreen } from "./previous-prompts-screen.tsx";
import { CardsGeneratedScreenWrapper } from "./cards-generated-screen-wrapper.tsx";

export const AiMassCreationScreen = observer(() => {
  const store = useAiMassCreationStore();

  if (store.screen.value === "how") {
    return <HowMassCreationWorksScreen />;
  }
  if (store.screen.value === "cardsGenerated") {
    return <CardsGeneratedScreenWrapper />;
  }
  if (store.screen.value === "previousPrompts") {
    return <PreviousPromptsScreen />;
  }
  return <AiMassCreationForm />;
});
