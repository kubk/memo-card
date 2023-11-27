import { observer } from "mobx-react-lite";
import { useReviewStore } from "../../store/review-store-context.tsx";
import { useMount } from "../../lib/react/use-mount.ts";
import { deckListStore } from "../../store/deck-list-store.ts";
import { DeckFinished } from "./deck-finished.tsx";
import { Review } from "./review.tsx";
import React from "react";
import { Hint } from "../../ui/hint.tsx";

export const RepeatAllScreen = observer(() => {
  const reviewStore = useReviewStore();

  useMount(() => {
    reviewStore.startAllRepeatReview(deckListStore.myDecks);
  });

  if (reviewStore.isFinished) {
    return <DeckFinished type={"repeat_all"} />;
  } else if (reviewStore.currentCardId) {
    return <Review />;
  }

  return (
    <div>
      <Hint>
        Amazing work! 🌟 You've repeated all the cards for today. Come back
        later for more.
      </Hint>
    </div>
  );
});
