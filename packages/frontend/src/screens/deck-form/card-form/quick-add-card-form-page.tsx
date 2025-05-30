import { useState } from "react";
import { QuickAddCardFormStore } from "./store/quick-add-card-form-store.ts";
import { CardFormWrapper } from "./card-form-wrapper.tsx";
import { deckListStore } from "../../../store/deck-list-store.ts";
import { screenStore } from "../../../store/screen-store.ts";
import { TextField } from "mobx-form-lite";
import { assert } from "api";

const createQuickAddCardFormStore = () => {
  const screen = screenStore.screen;
  assert(screen.type === "cardQuickAddForm");
  const deck = deckListStore.searchDeckById(screen.deckId);

  return new QuickAddCardFormStore(
    deck
      ? {
          speakingCardsField: new TextField(deck.speak_field),
          speakingCardsLocale: new TextField(deck.speak_locale),
          cardInputModeId: deck.card_input_mode_id || null,
        }
      : undefined,
  );
};

export function QuickAddCardFormPage() {
  const [quickAddCardStore] = useState(createQuickAddCardFormStore);

  return <CardFormWrapper cardFormStore={quickAddCardStore} />;
}
