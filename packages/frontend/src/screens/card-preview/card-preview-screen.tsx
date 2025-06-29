import { useState } from "react";
import { assert } from "api";
import { deckListStore } from "../../store/deck-list-store.ts";
import { CardPreview } from "../deck-form/card-form/card-preview.tsx";
import { createMockCardPreviewForm } from "../deck-form/card-form/create-mock-card-preview-form.ts";
import { screenStore } from "../../store/screen-store.ts";

export function CardPreviewScreen() {
  const { screen } = screenStore;
  assert(screen.type === "cardPreviewId");

  const { cardId, deckId } = screen;

  const deck = deckListStore.searchDeckById(deckId);
  const card = deck?.deckCards.find((card) => card.id === cardId);

  const [form] = useState(() => {
    if (!card || !deck) return null;
    return createMockCardPreviewForm(card, deck);
  });

  if (!form) {
    console.error("Card or deck not found: ", { cardId, deckId });
    return null;
  }

  return (
    <CardPreview
      form={form}
      onBack={() => {
        screenStore.back();
      }}
    />
  );
}
