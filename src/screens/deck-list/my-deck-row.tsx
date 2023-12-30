import { observer } from "mobx-react-lite";
import { css } from "@emotion/css";
import { theme } from "../../ui/theme.tsx";
import React from "react";
import { motion } from "framer-motion";
import { whileTap } from "../../ui/animations.ts";
import { DeckListItem } from "../../store/deck-list-store.ts";
import { CardsToReviewCount } from "./cards-to-review-count.tsx";

type Props = {
  item: DeckListItem;
  onClick: () => void;
};

export const MyDeckRow = observer((props: Props) => {
  const { item, onClick } = props;

  return (
    <motion.div
      whileTap={whileTap}
      onClick={onClick}
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
        key={item.id}
        className={css({
          color: theme.textColor,
          fontWeight: 500,
        })}
      >
        {item.name}
      </div>
      <div
        className={css({
          display: "flex",
          justifyContent: "space-between",
          gap: 10,
        })}
      >
        <CardsToReviewCount
          items={item.cardsToReview.filter((card) => card.type === "repeat")}
          color={theme.orange}
        />
        <CardsToReviewCount
          items={item.cardsToReview.filter((card) => card.type === "new")}
          color={theme.success}
        />
      </div>
    </motion.div>
  );
});
