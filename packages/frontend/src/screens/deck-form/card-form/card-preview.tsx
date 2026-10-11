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
import { ReviewScreenLayout } from "../../deck-review/review-screen-layout.tsx";

type Props = {
  form: CardPreviewFormData;
  onBack: () => void;
};

export function CardPreview(props: Props) {
  const { form, onBack } = props;
  const [cardPreviewStore] = useState(() => new CardPreviewStore(form));

  useBackButton(onBack);

  return (
    <ReviewScreenLayout
      header={
        <div className="flex min-h-6 items-center justify-between px-3 pt-3">
          <div className="flex items-center gap-3">
            {platform instanceof BrowserPlatform && (
              <BrowserBackButton className="ml-2" />
            )}
          </div>
          {cardPreviewStore.isOpened && (
            <RotateCcwIcon
              className="cursor-pointer"
              size={24}
              onClick={() => {
                cardPreviewStore.revert();
              }}
            />
          )}
        </div>
      }
    >
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
    </ReviewScreenLayout>
  );
}
