import { useReviewStore } from "./store/review-store-context.tsx";
import { css } from "@emotion/css";
import { theme } from "../../ui/theme.tsx";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { observer } from "mobx-react-lite";

export const ReviewDeckName = observer(() => {
  const reviewStore = useReviewStore();

  const deckName = reviewStore.currentCard?.deckName;

  return (
    <AnimatePresence initial={false}>
      <motion.div
        key={deckName}
        exit={{ y: 50, opacity: 0, position: "absolute" }}
        animate={{ y: 0, opacity: 1 }}
        initial={{ y: -50, opacity: 0 }}
        className={css({
          position: "absolute",
          top: 41,
          fontSize: 14,
          whiteSpace: "nowrap",
          color: theme.hintColor,
        })}
      >
        {deckName}
      </motion.div>
    </AnimatePresence>
  );
});
