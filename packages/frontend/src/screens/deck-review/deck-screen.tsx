import { useState } from "react";
import { Review } from "./review.tsx";
import { DeckPreview } from "./deck-preview.tsx";
import { useReviewStore } from "./store/review-store-context.tsx";
import { DeckFinished } from "./deck-finished.tsx";
import { screenStore } from "../../store/screen-store.ts";
import { assert } from "api";
import { DeckScreenStore } from "./store/deck-screen-store.ts";

export function DeckScreen() {
  const reviewStore = useReviewStore();
  const route = screenStore.screen;
  assert(route.type === "deckPreview", "DeckScreen requires a deck route");
  const [deckScreenStore] = useState(() => new DeckScreenStore(route.deckId));

  if (reviewStore.isFinished) {
    return <DeckFinished type={"deck"} />;
  } else if (reviewStore.currentCardId) {
    return <Review />;
  }

  return <DeckPreview store={deckScreenStore} />;
}
