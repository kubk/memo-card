import { ProgressBar } from "../../ui/progress-bar.tsx";
import { useReviewStore } from "./store/review-store-context.tsx";
import { useBackButton } from "../../lib/platform/use-back-button.ts";
import { useHotkeys } from "react-hotkeys-hook";
import { ReviewDeckName } from "./review-deck-name.tsx";
import { CardReviewWithControls } from "./card-review-with-controls.tsx";
import { XIcon } from "lucide-react";
import { screenStore } from "../../store/screen-store.ts";
import { CardContextMenu } from "./card-context-menu.tsx";
import { hapticImpact } from "../../lib/platform/telegram/haptics.ts";

export function Review() {
  const reviewStore = useReviewStore();
  useBackButton(() => {
    reviewStore.submitUnfinished();
  });

  useHotkeys("1", reviewStore.onAgain);
  useHotkeys("2", reviewStore.onHard);
  useHotkeys("3", reviewStore.onGood);
  useHotkeys("4", reviewStore.onEasy);

  useHotkeys("enter", () => {
    if (reviewStore.currentCard?.isOpened) {
      reviewStore.onGood();
    } else {
      reviewStore.open();
    }
  });

  return (
    <div className="flex flex-col items-center justify-center h-screen relative overflow-hidden">
      <div className="w-full flex items-center gap-2 absolute top-2 left-0">
        <button
          className="text-hint active:scale-90 cursor-pointer"
          onClick={() => {
            hapticImpact("medium");
            screenStore.back();
            reviewStore.submitUnfinished();
          }}
        >
          <XIcon size={24} />
        </button>
        {reviewStore.initialCardCount && (
          <ProgressBar
            value={reviewStore.reviewedCardsCount}
            max={reviewStore.initialCardCount}
          />
        )}

        <CardContextMenu />
      </div>

      <ReviewDeckName />
      <CardReviewWithControls
        card={reviewStore.currentCard}
        onAgain={reviewStore.onAgain}
        onHard={reviewStore.onHard}
        onGood={reviewStore.onGood}
        onEasy={reviewStore.onEasy}
        onShowAnswer={reviewStore.open}
        onReviewCardWithAnswers={reviewStore.onReviewCardWithAnswers}
      />
    </div>
  );
}
