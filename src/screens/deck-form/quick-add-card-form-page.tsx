import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { QuickAddCardFormStore } from "./store/quick-add-card-form-store.ts";
import { CardFormWrapper } from "./card-form-wrapper.tsx";
import { deckListStore } from "../../store/deck-list-store.ts";
import { screenStore } from "../../store/screen-store.ts";
import { assert } from "../../lib/typescript/assert.ts";
import { TextField } from "mobx-form-lite";

const createQuickAddCardFormStore = () => {
  const screen = screenStore.screen;
  assert(screen.type === "cardQuickAddForm");
  const deck = deckListStore.searchDeckById(screen.deckId);

  return new QuickAddCardFormStore(
    deck
      ? {
          speakingCardsField: new TextField(deck.speak_field),
          speakingCardsLocale: new TextField(deck.speak_locale),
        }
      : undefined,
  );
};

export const QuickAddCardFormPage = observer(() => {
  const [quickAddCardStore] = useState(createQuickAddCardFormStore);

  return <CardFormWrapper cardFormStore={quickAddCardStore} />;
});
