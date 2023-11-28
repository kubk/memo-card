import React from "react";
import { observer } from "mobx-react-lite";
import { Review } from "./review.tsx";
import { DeckPreview } from "./deck-preview.tsx";
import { useReviewStore } from "../../store/review-store-context.tsx";
import { DeckFinished } from "./deck-finished.tsx";

export const DeckScreen = observer(() => {
  const reviewStore = useReviewStore();

  if (reviewStore.isFinished) {
    return <DeckFinished type={"deck"} />;
  } else if (reviewStore.currentCardId) {
    return <Review />;
  }
  return <DeckPreview />;
});
