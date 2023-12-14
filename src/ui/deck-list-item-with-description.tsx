import { observer } from "mobx-react-lite";
import { motion } from "framer-motion";
import { whileTap } from "./animations.ts";
import { css } from "@emotion/css";
import { theme } from "./theme.tsx";
import LinesEllipsis from "react-lines-ellipsis";
import React from "react";
import { DeckCategoryLogo } from "./deck-category-logo.tsx";

type Props = {
  deck: {
    id: number;
    name: string;
    description: string | null;
    available_in: string | null;
    deck_category?: { name: string; logo: string | null } | null;
  };
  onClick: () => void;
  titleRightSlot?: React.ReactNode;
};

export const DeckListItemWithDescription = observer((props: Props) => {
  const { deck, onClick, titleRightSlot } = props;

  return (
    <motion.div
      whileTap={whileTap}
      className={css({
        display: "flex",
        flexDirection: "column",
        gap: 4,
        borderRadius: theme.borderRadius,
        padding: 12,
        cursor: "pointer",
        background: theme.secondaryBgColor,
      })}
      onClick={onClick}
    >
      <div
        key={deck.id}
        className={css({
          color: theme.textColor,
          fontWeight: 500,
          position: "relative",
        })}
      >
        {deck.deck_category?.logo ? (
          <DeckCategoryLogo
            logo={deck.deck_category.logo}
            categoryName={deck.deck_category.name}
          />
        ) : null}
        {deck.name}
        {titleRightSlot}
      </div>
      <div
        className={css({
          color: theme.hintColor,
          fontSize: 14,
        })}
      >
        <LinesEllipsis
          text={deck.description}
          maxLine="2"
          ellipsis="..."
          trimRight
          basedOn="words"
        />
      </div>
    </motion.div>
  );
});
