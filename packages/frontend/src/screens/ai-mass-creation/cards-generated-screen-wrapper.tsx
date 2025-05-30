import { useAiMassCreationStore } from "./store/ai-mass-creation-store-provider.tsx";
import { GeneratedCardPreviewScreen } from "./generated-card-preview-screen.tsx";
import { CardsGeneratedScreen } from "./cards-generated-screen.tsx";
import { assert } from "api";

export function CardsGeneratedScreenWrapper() {
  const store = useAiMassCreationStore();
  assert(store.massCreationForm);

  if (store.massCreationFormPreviewCard) {
    return (
      <GeneratedCardPreviewScreen card={store.massCreationFormPreviewCard} />
    );
  }

  return <CardsGeneratedScreen />;
}
