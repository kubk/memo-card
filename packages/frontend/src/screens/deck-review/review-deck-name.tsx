import { useReviewStore } from "./store/review-store-context.tsx";
import { AnimatePresence, m } from "framer-motion";
import { LazyLoadFramerMotion } from "../../lib/framer-motion/lazy-load-framer-motion.tsx";

export function ReviewDeckName() {
  const reviewStore = useReviewStore();

  const deckName = reviewStore.currentCard?.deckName;

  return (
    <LazyLoadFramerMotion>
      <AnimatePresence initial={false}>
        <m.div
          key={deckName}
          exit={{ y: 50, opacity: 0, position: "absolute" }}
          animate={{ y: 0, opacity: 1 }}
          initial={{ y: -50, opacity: 0 }}
          className="absolute top-10 text-sm whitespace-nowrap text-hint"
        >
          {deckName}
        </m.div>
      </AnimatePresence>
    </LazyLoadFramerMotion>
  );
}
