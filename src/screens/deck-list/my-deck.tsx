import { observer } from "mobx-react-lite";
import { css } from "@emotion/css";
import { theme } from "../../ui/theme.tsx";
import React from "react";
import { motion } from "framer-motion";
import { whileTap } from "../../ui/animations.ts";
import { screenStore } from "../../store/screen-store.ts";
import { DeckWithCardsWithReviewType } from "../../store/deck-list-store.ts";

type Props = { deck: DeckWithCardsWithReviewType };

export const MyDeck = observer((props: Props) => {
  const { deck } = props;

  return (
    <motion.div
      whileTap={whileTap}
      onClick={() => {
        screenStore.navigateToMineDeck(deck.id);
      }}
      className={css({
        display: "flex",
        justifyContent: "space-between",
        cursor: "pointer",
        gap: 4,
        borderRadius: 8,
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
          color: theme.success,
          fontWeight: 600,
        })}
      >
        {deck.cardsToReview.length}
      </div>
    </motion.div>
  );
});
