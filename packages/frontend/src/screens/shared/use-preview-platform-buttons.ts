import { useBackButton } from "../../lib/platform/use-back-button.ts";
import { useMainButton } from "../../lib/platform/use-main-button.ts";
import { useProgress } from "../../lib/platform/use-progress.tsx";
import { screenStore } from "../../store/screen-store.ts";
import { type DeckScreenStore } from "../deck-review/store/deck-screen-store.ts";
import { type FolderScreenStore } from "../folder-review/store/folder-screen-store.ts";
import { useReviewStore } from "../deck-review/store/review-store-context.tsx";

export function usePreviewPlatformButtons(
  store: DeckScreenStore | FolderScreenStore,
) {
  const reviewStore = useReviewStore();

  useBackButton(() => {
    screenStore.back();
  });

  useProgress(() => store.isMainButtonLoading);

  useMainButton(
    () => store.mainButtonText,
    () => store.onMainButtonClick(reviewStore),
    () => store.isMainButtonVisible,
  );
}
