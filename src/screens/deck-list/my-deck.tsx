import { observer } from "mobx-react-lite";
import { css } from "@emotion/css";
import { theme } from "../../ui/theme.tsx";
import React from "react";
import { motion } from "framer-motion";
import { whileTap } from "../../ui/animations.ts";
import { screenStore } from "../../store/screen-store.ts";
import { DeckWithCardsWithReviewType } from "../../store/deck-list-store.ts";
import { CardsToReviewCount } from "./cards-to-review-count.tsx";

type Props = {
  deck: DeckWithCardsWithReviewType;
};

export const MyDeck = observer((props: Props) => {
  const { deck } = props;

  return (
    <motion.div
      whileTap={whileTap}
      onClick={() => {
        screenStore.go({ type: "deckMine", deckId: deck.id });
      }}
      className={css({
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        cursor: "pointer",
        gap: 4,
        borderRadius: theme.borderRadius,
        padding: 12,
        background: theme.secondaryBgColor,
      })}
    >
      <div
        key={deck.id}
        className={css({
          color: theme.textColor,
          fontWeight: 500,
        })}
      >
        {deck.name}
      </div>
      <div
        className={css({
          display: "flex",
          justifyContent: "space-between",
          gap: 10,
        })}
      >
        <CardsToReviewCount
          items={deck.cardsToReview.filter((card) => card.type === "repeat")}
          color={theme.orange}
        />
        <CardsToReviewCount
          items={deck.cardsToReview.filter((card) => card.type === "new")}
          color={theme.success}
        />
      </div>
    </motion.div>
  );
});
