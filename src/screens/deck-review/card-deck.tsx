import React, { useState } from "react";
import { useMotionValue, useTransform } from "framer-motion";
import { Card, cardSize } from "./card.tsx";
import { observer } from "mobx-react-lite";
import { css } from "@emotion/css";
import { theme } from "../../ui/theme.tsx";
import throttle from "just-throttle";
import { CardState } from "../../store/card-form-store.ts";
import { ProgressBar } from "../../ui/progress-bar.tsx";
import { useReviewStore } from "../../store/review-store-context.tsx";
import { Button } from "../../ui/button.tsx";
import { StopReviewButton } from "./stop-review-button.tsx";
import { screenStore } from "../../store/screen-store.ts";

const rotateBorder = 80;

export const CardDeck = observer(() => {
  const reviewStore = useReviewStore();
  const [frontCardX, setFrontCardX] = useState(0);
  const [isRotateAnimating, setIsRotateAnimating] = useState(false);
  const x = useMotionValue(0);
  const scaleBelowCard = useTransform(
    x,
    [-rotateBorder * 5, 0, rotateBorder * 5],
    [1, 0.5, 1],
  );
  const backgroundColorFrontCard = useTransform(
    x,
    [-rotateBorder, 0, rotateBorder],
    [theme.dangerLight, theme.secondaryBgColorComputed, theme.successLight],
  );
  const opacityFrontCard = useTransform(
    x,
    [
      -rotateBorder * 5,
      -rotateBorder * 3.5,
      0,
      rotateBorder * 3.5,
      rotateBorder * 5,
    ],
    [0, 1, 1, 1, 0],
  );
  const rotateFrontCard = useTransform(
    x,
    [-rotateBorder, 0, rotateBorder],
    [-10, 0, 10],
  );

  const animateCardRotate = (newFrontCardX: number, cardState: CardState) => {
    setFrontCardX(newFrontCardX);
    setIsRotateAnimating(true);

    setTimeout(() => {
      setFrontCardX(0);
      setIsRotateAnimating(false);
      x.set(0);
      reviewStore.changeState(cardState);
    }, 500);
  };

  const onLeft = throttle(
    () => {
      animateCardRotate(-rotateBorder * 5, CardState.Forget);
    },
    500,
    { leading: true },
  );

  const onRight = throttle(
    () => {
      animateCardRotate(rotateBorder * 5, CardState.Remember);
    },
    500,
    { leading: true },
  );

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
      <StopReviewButton
        onClick={() => {
          reviewStore.submit();
          screenStore.navigateToMain();
        }}
      />
      <div
        style={{
          width: cardSize,
          position: "absolute",
          top: 8,
        }}
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
      <div
        className={css({
          height: 350,
          position: "relative",
          width: "100%",
        })}
      >
        {reviewStore.currentCard && (
          <Card
            card={reviewStore.currentCard}
            style={{
              x,
              zIndex: 1,
              backgroundColor: backgroundColorFrontCard,
              rotate: rotateFrontCard,
              opacity: opacityFrontCard,
            }}
            animate={{
              x: frontCardX,
            }}
          />
        )}

        {reviewStore.nextCard && (
          <Card
            card={reviewStore.nextCard}
            style={{
              scale: scaleBelowCard,
              zIndex: 0,
            }}
          />
        )}
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
          {reviewStore.currentCard.isOpened && !isRotateAnimating ? (
            <>
              <Button key={"forgot"} onClick={() => onLeft()} outline>
                Need to review
              </Button>
              <Button key={"remember"} onClick={() => onRight()}>
                I got it right
              </Button>
            </>
          ) : (
            <Button
              key={"show"}
              onClick={() => {
                reviewStore.open();
              }}
            >
              Show answer
            </Button>
          )}
        </div>
      )}
    </div>
  );
});
