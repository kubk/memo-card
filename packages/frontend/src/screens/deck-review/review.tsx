import { ProgressBar } from "../../ui/progress-bar.tsx";
import { useReviewStore } from "./store/review-store-context.tsx";
import { useBackButton } from "../../lib/platform/use-back-button.ts";
import { useHotkeys } from "react-hotkeys-hook";
import { ReviewDeckName } from "./review-deck-name.tsx";
import { CardReviewWithControls } from "./card-review-with-controls.tsx";
import { XIcon } from "lucide-react";
import { screenStore } from "../../store/screen-store.ts";
import { CardContextMenu } from "./card-context-menu.tsx";
import { platform } from "../../lib/platform/platform.ts";
import { deckListStore } from "../../store/deck-list-store.ts";
import { cn } from "../../ui/cn.ts";

export function Review() {
  const reviewStore = useReviewStore();

  const onSubmitUnfinished = () => {
    reviewStore.submitUnfinished()?.then(() => {
      deckListStore.myInfoQuery.invalidate();
    });
  };

  useBackButton(() => {
    onSubmitUnfinished();
  });

  useHotkeys("1", reviewStore.onAgain);
  useHotkeys("2", reviewStore.onHard);
  useHotkeys("3", reviewStore.onGood);
  useHotkeys("4", reviewStore.onEasy);
  useHotkeys("enter", reviewStore.open);

  return (
    <div className="relative flex h-[calc(var(--tg-viewport-height,100vh)_-_var(--tg-safe-area-inset-top,0px)_-_var(--tg-safe-area-inset-bottom,0px)_-_var(--app-top-offset,0px))] flex-col items-center justify-center overflow-hidden">
      <div className="absolute left-0 top-2 flex w-full items-center gap-2">
        <button
          className={cn("text-hint active:scale-90 cursor-pointer -ms-[3px]")}
          onClick={() => {
            platform.haptic("medium");
            screenStore.back();
            onSubmitUnfinished();
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

        <div className={cn("mt-[4px] -ms-[4px]")}>
          <CardContextMenu />
        </div>
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
