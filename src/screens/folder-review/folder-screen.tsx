import { observer } from "mobx-react-lite";
import { useReviewStore } from "../deck-review/store/review-store-context.tsx";
import { DeckFinished } from "../deck-review/deck-finished.tsx";
import { Review } from "../deck-review/review.tsx";
import React from "react";
import { FolderPreview } from "./folder-preview.tsx";

export const FolderScreen = observer(() => {
  const reviewStore = useReviewStore();

  if (reviewStore.isFinished) {
    return <DeckFinished type={"deck"} />;
  } else if (reviewStore.currentCardId) {
    return <Review />;
  }

  return <FolderPreview />;
});
