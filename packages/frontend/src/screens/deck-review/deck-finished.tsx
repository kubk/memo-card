import { useReviewStore } from "./store/review-store-context.tsx";
import { useMount } from "../../lib/react/use-mount.ts";
import { screenStore } from "../../store/screen-store.ts";
import { useMainButton } from "../../lib/platform/use-main-button.ts";
import { useProgress } from "../../lib/platform/use-progress.tsx";
import { t } from "../../translations/t.ts";
import { getEncouragingMessage } from "../../translations/get-encouraging-message.tsx";
import { WantMoreCardsButton } from "./want-more-cards-button.tsx";
import { deckListStore } from "../../store/deck-list-store.ts";
import { Flex } from "../../ui/flex.tsx";
import { useHotkeys } from "react-hotkeys-hook";
import { ReviewedCardsList } from "./reviewed-cards-list.tsx";
import { m } from "framer-motion";
import { LazyLoadFramerMotion } from "../../lib/framer-motion/lazy-load-framer-motion.tsx";

type Props = {
  type: "deck" | "repeat_all";
  newCardsCount?: number;
};

export function DeckFinished(props: Props) {
  const { type, newCardsCount } = props;
  const reviewStore = useReviewStore();

  useMount(() => {
    reviewStore.submitFinished(() => {
      deckListStore.load();
    });
  });

  const onBack = () => {
    screenStore.go({ type: "main" });
  };

  useHotkeys("enter", onBack);
  useMainButton(t("go_back"), onBack);
  useProgress(() => reviewStore.reviewCardsRequest.isLoading);

  return (
    <>
      <Flex direction={"column"}>
        <LazyLoadFramerMotion>
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0, duration: 0.4 }}
            className="mx-auto flex flex-col p-6 bg-bg rounded-[12px]"
          >
            <span className="mb-2">
              {type === "deck"
                ? t("review_deck_finished")
                : t("review_all_cards")}
            </span>
            {type === "repeat_all" ? (
              <p>
                <WantMoreCardsButton newCardsCount={newCardsCount} />
              </p>
            ) : (
              <p>{getEncouragingMessage()}</p>
            )}
          </m.div>
        </LazyLoadFramerMotion>
      </Flex>
      <div className="mt-1.5 mb-[100px]">
        <ReviewedCardsList reviewedCards={reviewStore.sortedReviewedCards} />
      </div>
    </>
  );
}
