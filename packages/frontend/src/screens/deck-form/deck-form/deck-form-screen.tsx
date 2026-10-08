import { DeckForm } from "./deck-form.tsx";
import { useDeckFormStore } from "./store/deck-form-store-context.tsx";
import { CardFormWrapper } from "../card-form/card-form-wrapper.tsx";
import { CardFormStoreProvider } from "../card-form/store/card-form-store-context.tsx";

export function DeckFormScreen() {
  const deckFormStore = useDeckFormStore();

  if (deckFormStore.deckFormScreen === "cardForm") {
    return (
      <CardFormStoreProvider>
        <CardFormWrapper />
      </CardFormStoreProvider>
    );
  }

  if (deckFormStore.deckFormScreen === "deckForm") {
    return <DeckForm />;
  }

  return deckFormStore.deckFormScreen satisfies never;
}
