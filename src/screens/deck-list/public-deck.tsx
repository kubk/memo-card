import { observer } from "mobx-react-lite";
import { css } from "@emotion/css";
import { theme } from "../../ui/theme.tsx";
import LinesEllipsis from "react-lines-ellipsis";
import React from "react";
import { whileTap } from "../../ui/animations.ts";
import { motion } from "framer-motion";
import { DeckWithCardsDbType } from "../../../functions/db/deck/decks-with-cards-schema.ts";
import { screenStore } from "../../store/screen-store.ts";

type Props = {
  deck: DeckWithCardsDbType;
};

export const PublicDeck = observer((props: Props) => {
  const { deck } = props;

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
      onClick={() => {
        screenStore.go({ type: "deckPublic", deckId: deck.id });
      }}
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
