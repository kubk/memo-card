import { useReviewStore } from "../deck-review/store/review-store-context.tsx";
import { DeckFinished } from "../deck-review/deck-finished.tsx";
import { Review } from "../deck-review/review.tsx";
import { FolderPreview } from "./folder-preview.tsx";
import { useState } from "react";
import { screenStore } from "../../store/screen-store.ts";
import { assert } from "api";
import { FolderScreenStore } from "./store/folder-screen-store.ts";

export function FolderScreen() {
  const reviewStore = useReviewStore();
  const route = screenStore.screen;
  assert(
    route.type === "folderPreview",
    "FolderScreen requires a folder route",
  );
  const [folderScreenStore] = useState(
    () => new FolderScreenStore(route.folderId),
  );

  if (reviewStore.isFinished) {
    return <DeckFinished type={"deck"} />;
  } else if (reviewStore.currentCardId) {
    return <Review />;
  }

  return <FolderPreview store={folderScreenStore} />;
}
