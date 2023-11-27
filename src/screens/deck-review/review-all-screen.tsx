import { observer } from "mobx-react-lite";
import { useReviewStore } from "../../store/review-store-context.tsx";
import { useMount } from "../../lib/react/use-mount.ts";
import { deckListStore } from "../../store/deck-list-store.ts";
import { DeckFinished } from "./deck-finished.tsx";
import { Review } from "./review.tsx";
import React from "react";

export const ReviewAllScreen = observer(() => {
  const reviewStore = useReviewStore();

  useMount(() => {
    reviewStore.startAllRepeatReview(deckListStore.myDecks);
  });

  if (reviewStore.isFinished) {
    return <DeckFinished />;
  } else if (reviewStore.currentCardId) {
    return <Review />;
  }

  return null;
});
