import React from "react";
import { Card, cardSize } from "../shared/card/card.tsx";
import { observer } from "mobx-react-lite";
import { css } from "@emotion/css";
import throttle from "just-throttle";
import { CardState } from "./store/card-under-review-store.ts";
import { ProgressBar } from "../../ui/progress-bar.tsx";
import { useReviewStore } from "./store/review-store-context.tsx";
import { Button } from "../../ui/button.tsx";
import { useBackButton } from "../../lib/telegram/use-back-button.tsx";
import { useHotkeys } from "react-hotkeys-hook";
import { t } from "../../translations/t.ts";
import { ReviewDeckName } from "./review-deck-name.tsx";

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
      <div
        className={css({
          height: 350,
          position: "relative",
          width: "100%",
        })}
      >
        {reviewStore.currentCard && <Card card={reviewStore.currentCard} />}
      </div>
      {reviewStore.currentCard && (
        <div
          className={css({
            position: "absolute",
            bottom: 32,
            display: "flex",
            alignItems: "center",
            gap: 16,
            width: cardSize,
            "> button": {
              flex: 1,
            },
          })}
        >
          {reviewStore.currentCard.isOpened ? (
            <>
              <Button key={"forgot"} onClick={() => onWrong()} outline>
                {t("review_need_to_repeat")}
              </Button>
              <Button key={"remember"} onClick={() => onCorrect()}>
                {t("review_right")}
              </Button>
            </>
          ) : (
            <Button
              key={"show"}
              onClick={() => {
                reviewStore.open();
              }}
            >
              {t("review_show_answer")}
            </Button>
          )}
        </div>
      )}
    </div>
  );
});
