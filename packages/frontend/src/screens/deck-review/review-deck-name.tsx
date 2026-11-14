import { useReviewStore } from "./store/review-store-context.tsx";
import * as m from "motion/react-m";
import { AnimatePresence } from "motion/react";

export function ReviewDeckName() {
  const reviewStore = useReviewStore();

  const deckName = reviewStore.currentCard?.deckName;

  return (
    <div className="relative flex h-5 justify-center overflow-hidden">
      <AnimatePresence initial={false}>
        <m.div
          key={deckName}
          exit={{ y: "100%", opacity: 0, position: "absolute" }}
          animate={{ y: 0, opacity: 1 }}
          initial={{ y: "-100%", opacity: 0 }}
          className="text-sm whitespace-nowrap text-hint"
        >
          {deckName}
        </m.div>
      </AnimatePresence>
    </div>
  );
}
