import React from "react";
import { cardSize } from "../shared/card/card.tsx";
import { observer } from "mobx-react-lite";
import { css } from "@emotion/css";
import throttle from "just-throttle";
import { CardState } from "./store/card-under-review-store.ts";
import { ProgressBar } from "../../ui/progress-bar.tsx";
import { useReviewStore } from "./store/review-store-context.tsx";
import { useBackButton } from "../../lib/telegram/use-back-button.tsx";
import { useHotkeys } from "react-hotkeys-hook";
import { ReviewDeckName } from "./review-deck-name.tsx";
import { CardReviewWithControls } from "./card-review-with-controls.tsx";

export const Review = observer(() => {
  const reviewStore = useReviewStore();
  useBackButton(() => {
    reviewStore.submitUnfinished();
  });

  const onWrong = throttle(
    () => {
      reviewStore.changeState(CardState.Forget);
    },
    100,
    { leading: true },
  );

  const onCorrect = throttle(
    () => {
      reviewStore.changeState(CardState.Remember);
    },
    100,
    { leading: true },
  );

  useHotkeys("1", () => {
    if (reviewStore.currentCard?.isOpened) {
      onWrong();
    }
  });

  useHotkeys("2", () => {
    if (reviewStore.currentCard?.isOpened) {
      onCorrect();
    }
  });

  useHotkeys("enter", () => {
    if (reviewStore.currentCard?.isOpened) {
      onCorrect();
    } else {
      reviewStore.open();
    }
  });

  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        position: "relative",
        overflowX: "hidden",
      })}
    >
      <div
        className={css({
          width: cardSize,
          position: "absolute",
          top: 8,
        })}
      >
        {reviewStore.initialCardCount && (
          <ProgressBar
            value={
              reviewStore.initialCardCount - reviewStore.cardsToReview.length
            }
            max={reviewStore.initialCardCount}
          />
        )}
      </div>
      <ReviewDeckName />
      <CardReviewWithControls
        card={reviewStore.currentCard}
        onWrong={onWrong}
        onCorrect={onCorrect}
        onShowAnswer={reviewStore.open}
        onReviewCardWithAnswers={reviewStore.onReviewCardWithAnswers}
      />
    </div>
  );
});
