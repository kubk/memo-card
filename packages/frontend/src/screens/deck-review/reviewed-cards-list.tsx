import { ReviewedCard } from "./store/review-store.ts";
import { removeAllTags } from "../../lib/sanitize-html/remove-all-tags.ts";
import { m } from "framer-motion";
import { LazyLoadFramerMotion } from "../../lib/framer-motion/lazy-load-framer-motion.tsx";
import { ListHeader } from "../../ui/list-header.tsx";
import { t } from "../../translations/t.ts";
import {
  reviewOutcomeStyles,
  reviewOutcomeLabels,
} from "./shared/review-outcome-styles.ts";

type Props = {
  reviewedCards: ReviewedCard[];
};

export function ReviewedCardsList(props: Props) {
  const { reviewedCards } = props;

  if (reviewedCards.length === 0) {
    return null;
  }

  return (
    <LazyLoadFramerMotion>
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <ListHeader text={t("cards")} />
        <div className="space-y-2">
          {reviewedCards.map((card, index) => {
            // Cap staggering to first 15 cards to avoid long delays
            const staggerDelay =
              index < 15 ? 0.5 + index * 0.1 : 0.5 + 15 * 0.1;

            return (
              <m.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: staggerDelay,
                  duration: 0.3,
                }}
                className="bg-bg rounded-[12px] p-3 flex justify-between items-start"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-text">
                    {removeAllTags({ text: card.front })}
                  </div>
                  <div className="text-hint text-sm mt-1">
                    {removeAllTags({ text: card.back })}
                  </div>
                </div>
                <div
                  className={`px-2 py-1 rounded-md text-xs font-medium shrink-0 border ${
                    reviewOutcomeStyles[card.outcome]
                  }`}
                >
                  {reviewOutcomeLabels[card.outcome]()}
                </div>
              </m.div>
            );
          })}
        </div>
      </m.div>
    </LazyLoadFramerMotion>
  );
}
