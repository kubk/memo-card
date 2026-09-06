import { useReviewStore } from "./store/review-store-context.tsx";
import { useMount } from "../../lib/react/use-mount.ts";
import { deckListStore } from "../../store/deck-list-store.ts";
import { RepeatReviewScreen } from "./repeat-review-screen.tsx";

export function RepeatAllScreen() {
  const reviewStore = useReviewStore();

  useMount(() => {
    reviewStore.startAllRepeatReview(deckListStore.myDecks);
  });

  return <RepeatReviewScreen />;
}
