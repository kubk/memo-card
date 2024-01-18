import React from "react";
import { observer } from "mobx-react-lite";
import { DeckForm } from "./deck-form.tsx";
import { useDeckFormStore } from "./store/deck-form-store-context.tsx";
import { CardList } from "./card-list.tsx";
import { CardFormWrapper } from "./card-form-wrapper.tsx";

export const DeckFormScreen = observer(() => {
  const deckFormStore = useDeckFormStore();

  if (deckFormStore.deckFormScreen === "cardList") {
    return <CardList />;
  }

  if (deckFormStore.deckFormScreen === "cardForm") {
    return <CardFormWrapper cardFormStore={deckFormStore} />;
  }

  return <DeckForm />;
});
