import { useState } from "react";
import { assert, type DeckCardDbType } from "api";
import { CardPreview } from "../deck-form/card-form/card-preview.tsx";
import { createMockCardPreviewForm } from "../deck-form/card-form/create-mock-card-preview-form.ts";
import { screenStore } from "../../store/screen-store.ts";
import { DeckScreenStore } from "../deck-review/store/deck-screen-store.ts";
import { useProgress } from "../../lib/platform/use-progress.tsx";
import { ErrorScreen } from "../error-screen/error-screen.tsx";
import { type DeckWithCardsWithReviewType } from "../../store/deck-list-store.ts";

function LoadedCardPreview({
  card,
  deck,
}: {
  card: DeckCardDbType;
  deck: DeckWithCardsWithReviewType;
}) {
  const [form] = useState(() => createMockCardPreviewForm(card, deck));

  return (
    <CardPreview
      form={form}
      onBack={() => {
        screenStore.back();
      }}
    />
  );
}

export function CardPreviewScreen() {
  const { screen } = screenStore;
  assert(screen.type === "cardPreviewId");

  const { cardId, deckId } = screen;
  const [store] = useState(() => new DeckScreenStore(deckId));

  useProgress(() => store.isInitialLoading);

  const deck = store.deck;
  const card = deck?.deckCards.find((card) => card.id === cardId);

  if (!deck || !card) {
    if (store.isInitialLoading) {
      return null;
    }

    console.error("Card or deck not found: ", { cardId, deckId });
    return <ErrorScreen />;
  }

  return <LoadedCardPreview card={card} deck={deck} />;
}
