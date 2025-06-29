import { useState } from "react";
import { Review } from "./review.tsx";
import { DeckPreview } from "./deck-preview.tsx";
import { useReviewStore } from "./store/review-store-context.tsx";
import { DeckFinished } from "./deck-finished.tsx";
import { CardListWithPreviewReadonly } from "./preview-readonly/card-list-with-preview-readonly.tsx";
import { deckListStore } from "../../store/deck-list-store.ts";
import { BooleanToggle } from "mobx-form-lite";

export function DeckScreen() {
  const reviewStore = useReviewStore();
  const [previewStore] = useState(() => new BooleanToggle(false));

  if (reviewStore.isFinished) {
    return <DeckFinished type={"deck"} />;
  } else if (reviewStore.currentCardId) {
    return <Review />;
  }

  if (previewStore.value) {
    const deck = deckListStore.selectedDeck;
    if (!deck) {
      console.error("DeckScreen: No selected deck for preview");
      return null;
    }
    const cards = deck.deckCards;
    const subtitle = deck.name || "";
    return (
      <CardListWithPreviewReadonly
        onBack={previewStore.setFalse}
        deck={deck}
        cards={cards}
        subtitle={subtitle}
      />
    );
  }

  return <DeckPreview onCardListPreview={previewStore.setTrue} />;
}
