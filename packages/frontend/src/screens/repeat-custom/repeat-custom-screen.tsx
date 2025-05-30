import { useReviewStore } from "../deck-review/store/review-store-context.tsx";
import { deckListStore } from "../../store/deck-list-store.ts";
import { DeckFinished } from "../deck-review/deck-finished.tsx";
import { Review } from "../deck-review/review.tsx";
import { Hint } from "../../ui/hint.tsx";
import { t } from "../../translations/t.ts";
import { WantMoreCardsButton } from "../deck-review/want-more-cards-button.tsx";
import { Flex } from "../../ui/flex.tsx";
import { useBackButton } from "../../lib/platform/use-back-button.ts";
import { screenStore } from "../../store/screen-store.ts";
import { useState } from "react";
import { BooleanToggle } from "mobx-form-lite";
import { action } from "mobx";
import { RepeatCustomSelector } from "./repeat-custom-selector.tsx";
import { RepeatCustomSelectorStore } from "./repeat-custom-selector-store.ts";
import { useMount } from "../../lib/react/use-mount.ts";

export function RepeatCustomScreen() {
  const reviewStore = useReviewStore();
  const [repeatCustomSelectorStore] = useState(
    () => new RepeatCustomSelectorStore(),
  );
  const [isSelector] = useState(() => new BooleanToggle(true));

  useMount(() => {
    return () => repeatCustomSelectorStore.dispose();
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
  } else if (isSelector.value) {
    return (
      <RepeatCustomSelector
        store={repeatCustomSelectorStore}
        onClick={action(() => {
          isSelector.setFalse();
          reviewStore.startCustomReview(
            repeatCustomSelectorStore.customCardsToReview,
          );
        })}
      />
    );
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
