import { type ReactNode } from "react";
import { useBackButton } from "../../lib/platform/use-back-button.ts";
import { screenStore } from "../../store/screen-store.ts";
import { deckListStore } from "../../store/deck-list-store.ts";
import { Flex } from "../../ui/flex.tsx";
import { Hint } from "../../ui/hint.tsx";
import { t } from "../../translations/t.ts";
import { DeckFinished } from "./deck-finished.tsx";
import { Review } from "./review.tsx";
import { useReviewStore } from "./store/review-store-context.tsx";
import { WantMoreCardsButton } from "./want-more-cards-button.tsx";

export function RepeatReviewScreen({
  idleContent,
}: {
  idleContent?: ReactNode;
}) {
  const reviewStore = useReviewStore();

  useBackButton(() => {
    screenStore.back();
  });

  if (reviewStore.isFinished) {
    return (
      <DeckFinished
        type={"repeat_all"}
        newCardsCount={deckListStore.newCardsCount}
      />
    );
  }

  if (reviewStore.currentCardId) {
    return <Review />;
  }

  if (idleContent) {
    return idleContent;
  }

  return (
    <Flex direction={"column"} gap={8}>
      <Hint>{t("no_cards_to_review_all")}</Hint>
      {deckListStore.newCardsCount > 0 ? (
        <Hint>
          <WantMoreCardsButton newCardsCount={deckListStore.newCardsCount} />
        </Hint>
      ) : null}
    </Flex>
  );
}
