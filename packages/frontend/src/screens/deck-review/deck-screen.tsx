import { useState } from "react";
import { Review } from "./review.tsx";
import { DeckPreview } from "./deck-preview.tsx";
import { useReviewStore } from "./store/review-store-context.tsx";
import { DeckFinished } from "./deck-finished.tsx";
import { CardListWithPreviewReadonly } from "./preview-readonly/card-list-with-preview-readonly.tsx";
import { BooleanToggle } from "mobx-form-lite";
import { screenStore } from "../../store/screen-store.ts";
import { assert } from "api";
import { DeckScreenStore } from "./store/deck-screen-store.ts";

export function DeckScreen() {
  const reviewStore = useReviewStore();
  const [previewStore] = useState(() => new BooleanToggle(false));
  const route = screenStore.screen;
  assert(route.type === "deckPreview", "DeckScreen requires a deck route");
  const [deckScreenStore] = useState(() => new DeckScreenStore(route.deckId));

  if (reviewStore.isFinished) {
    return <DeckFinished type={"deck"} />;
  } else if (reviewStore.currentCardId) {
    return <Review />;
  }

  if (previewStore.value) {
    const deck = deckScreenStore.deck;
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

  return (
    <DeckPreview
      store={deckScreenStore}
      onCardListPreview={previewStore.setTrue}
    />
  );
}
