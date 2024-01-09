import React from "react";
import { observer } from "mobx-react-lite";
import { DeckForm } from "./deck-form.tsx";
import { CardForm } from "./card-form.tsx";
import { useDeckFormStore } from "./store/deck-form-store-context.tsx";
import { CardList } from "./card-list.tsx";
import { CardPreview } from "./card-preview.tsx";
import { assert } from "../../lib/typescript/assert.ts";

export const DeckFormScreen = observer(() => {
  const deckFormStore = useDeckFormStore();

  if (deckFormStore.deckFormScreen === "cardList") {
    return <CardList />;
  }

  if (deckFormStore.deckFormScreen === "cardForm") {
    return <CardForm />;
  }

  if (deckFormStore.deckFormScreen === "cardPreview") {
    assert(deckFormStore.cardForm, "Card should not be empty before preview");
    return (
      <CardPreview
        form={deckFormStore.cardForm}
        onBack={deckFormStore.isCardPreviewSelected.setFalse}
      />
    );
  }

  return <DeckForm />;
});
