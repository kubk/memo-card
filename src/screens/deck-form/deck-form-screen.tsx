import React from "react";
import { observer } from "mobx-react-lite";
import { DeckForm } from "./deck-form.tsx";
import { CardForm } from "./card-form.tsx";
import { useDeckFormStore } from "./store/deck-form-store-context.tsx";
import { CardList } from "./card-list.tsx";

export const DeckFormScreen = observer(() => {
  const deckFormStore = useDeckFormStore();

  if (deckFormStore.deckFormScreen === "cardList") {
    return <CardList />;
  }
  if (deckFormStore.deckFormScreen === "cardForm") {
    return <CardForm />;
  }

  return <DeckForm />;
});
