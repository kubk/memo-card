import { useBackButton } from "../../../lib/platform/use-back-button.ts";
import { CardReviewWithControls } from "../../deck-review/card-review-with-controls.tsx";
import { useState } from "preact/compat";
import { CardPreviewStore } from "../../deck-review/store/card-preview-store.ts";
import { platform } from "../../../lib/platform/platform.ts";
import { BrowserPlatform } from "../../../lib/platform/browser/browser-platform.ts";
import { BrowserBackButton } from "../../shared/browser-platform/browser-back-button.tsx";
import { RotateCcwIcon } from "lucide-react";
import { CardPreviewFormData } from "./store/card-preview-types.ts";
import { BackBottomButton } from "../../shared/back-bottom-button.tsx";

type Props = {
  form: CardPreviewFormData;
  onBack: () => void;
};

export function CardPreview(props: Props) {
  const { form, onBack } = props;
  const [cardPreviewStore] = useState(() => new CardPreviewStore(form));

  useBackButton(onBack);

  return (
    <div className="relative flex h-[calc(var(--tg-viewport-height,100vh)_-_var(--tg-safe-area-inset-top,0px)_-_var(--tg-safe-area-inset-bottom,0px)_-_var(--app-top-offset,0px))] flex-col items-center justify-center overflow-x-hidden">
      <div className="absolute top-3 left-3 flex items-center gap-3">
        {platform instanceof BrowserPlatform && (
          <BrowserBackButton className="ml-2" />
        )}
      </div>
      {cardPreviewStore.isOpened && (
        <div className="absolute top-3 right-3">
          <RotateCcwIcon
            className="cursor-pointer"
            size={24}
            onClick={() => {
              cardPreviewStore.revert();
            }}
          />
        </div>
      )}

      <CardReviewWithControls
        onAgain={() => {}}
        onHard={() => {}}
        onGood={() => {}}
        onEasy={() => {}}
        onShowAnswer={() => {
          cardPreviewStore.open();
        }}
        cardOpenedRow={<BackBottomButton onClick={onBack} />}
        card={cardPreviewStore}
        onReviewCardWithAnswers={() => {}}
      />
    </div>
  );
}
