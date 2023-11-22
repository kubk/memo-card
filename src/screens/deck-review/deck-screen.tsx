import React from "react";
import { observer } from "mobx-react-lite";
import { Review } from "./review.tsx";
import { DeckPreview } from "./deck-preview.tsx";
import { useReviewStore } from "../../store/review-store-context.tsx";
import { DeckFinished } from "./deck-finished.tsx";
import { PreventTelegramSwipeDownClosingIos } from "../../lib/telegram/preventTelegramSwipeDownClosing.tsx";

export const DeckScreen = observer(() => {
  const reviewStore = useReviewStore();

  if (reviewStore.isFinished) {
    return (
      <PreventTelegramSwipeDownClosingIos withScroll={false}>
        <DeckFinished />
      </PreventTelegramSwipeDownClosingIos>
    );
  } else if (reviewStore.currentCardId) {
    return (
      <PreventTelegramSwipeDownClosingIos withScroll={false}>
        <Review />
      </PreventTelegramSwipeDownClosingIos>
    );
  }
  return <DeckPreview />;
});
