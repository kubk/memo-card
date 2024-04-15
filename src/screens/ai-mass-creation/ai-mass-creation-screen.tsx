import { observer } from "mobx-react-lite";
import { useAiMassCreationStore } from "./store/ai-mass-creation-store-provider.tsx";
import React from "react";
import { AiMassCreationForm } from "./ai-mass-creation-form.tsx";
import { HowMassCreationWorksScreen } from "./how-mass-creation-works-screen.tsx";
import { ApiKeysScreen } from "./api-keys-screen.tsx";
import { useMount } from "../../lib/react/use-mount.ts";
import { CardsGeneratedScreen } from "./cards-generated-screen.tsx";

export const AiMassCreationScreen = observer(() => {
  const store = useAiMassCreationStore();

  useMount(() => {
    store.load();
  });

  if (store.screen.value === "how") {
    return <HowMassCreationWorksScreen />;
  }
  if (store.screen.value === "apiKeys") {
    return <ApiKeysScreen />;
  }
  if (store.screen.value === "cardsGenerated") {
    return <CardsGeneratedScreen />;
  }
  return <AiMassCreationForm />;
});
