import { useReviewStore } from "../deck-review/store/review-store-context.tsx";
import { useState } from "preact/compat";
import { BooleanToggle } from "mobx-form-lite";
import { action } from "mobx";
import { RepeatCustomSelector } from "./repeat-custom-selector.tsx";
import { RepeatCustomSelectorStore } from "./repeat-custom-selector-store.ts";
import { useMount } from "../../lib/react/use-mount.ts";
import { RepeatReviewScreen } from "../deck-review/repeat-review-screen.tsx";

export function RepeatCustomScreen() {
  const reviewStore = useReviewStore();
  const [repeatCustomSelectorStore] = useState(
    () => new RepeatCustomSelectorStore(),
  );
  const [isSelector] = useState(() => new BooleanToggle(true));

  useMount(() => {
    return () => repeatCustomSelectorStore.dispose();
  });

  return (
    <RepeatReviewScreen
      idleContent={
        isSelector.value ? (
          <RepeatCustomSelector
            store={repeatCustomSelectorStore}
            onClick={action(() => {
              isSelector.setFalse();
              reviewStore.startCustomReview(
                repeatCustomSelectorStore.customCardsToReview,
              );
            })}
          />
        ) : undefined
      }
    />
  );
}
