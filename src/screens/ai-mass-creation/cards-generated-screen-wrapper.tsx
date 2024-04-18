import { observer } from "mobx-react-lite";
import { useAiMassCreationStore } from "./store/ai-mass-creation-store-provider.tsx";
import { assert } from "../../lib/typescript/assert.ts";
import { GeneratedCardPreviewScreen } from "./generated-card-preview-screen.tsx";
import React from "react";
import { CardsGeneratedScreen } from "./cards-generated-screen.tsx";

export const CardsGeneratedScreenWrapper = observer(() => {
  const store = useAiMassCreationStore();
  assert(store.massCreationForm);

  if (store.massCreationFormPreviewCard) {
    return (
      <GeneratedCardPreviewScreen card={store.massCreationFormPreviewCard} />
    );
  }

  return <CardsGeneratedScreen />;
});
