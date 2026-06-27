import { useReviewStore } from "./store/review-store-context.tsx";
import { useMount } from "../../lib/react/use-mount.ts";
import { deckListStore } from "../../store/deck-list-store.ts";
import { DeckFinished } from "./deck-finished.tsx";
import { Review } from "./review.tsx";
import { Hint } from "../../ui/hint.tsx";
import { t } from "../../translations/t.ts";
import { WantMoreCardsButton } from "./want-more-cards-button.tsx";
import { Flex } from "../../ui/flex.tsx";
import { useBackButton } from "../../lib/platform/use-back-button.ts";
import { screenStore } from "../../store/screen-store.ts";

export function RepeatAllScreen() {
  const reviewStore = useReviewStore();

  useMount(() => {
    reviewStore.startAllRepeatReview(deckListStore.myDecks);
  });

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
  } else if (reviewStore.currentCardId) {
    return <Review />;
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
