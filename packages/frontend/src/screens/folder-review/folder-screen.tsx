import { useReviewStore } from "../deck-review/store/review-store-context.tsx";
import { DeckFinished } from "../deck-review/deck-finished.tsx";
import { Review } from "../deck-review/review.tsx";
import { FolderPreviewWrapper } from "./folder-preview-wrapper.tsx";

export function FolderScreen() {
  const reviewStore = useReviewStore();

  if (reviewStore.isFinished) {
    return <DeckFinished type={"deck"} />;
  } else if (reviewStore.currentCardId) {
    return <Review />;
  }

  return <FolderPreviewWrapper />;
}
