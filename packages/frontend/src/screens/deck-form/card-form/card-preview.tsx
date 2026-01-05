import { useBackButton } from "../../../lib/platform/use-back-button.ts";
import { CardReviewWithControls } from "../../deck-review/card-review-with-controls.tsx";
import { useState } from "react";
import { CardPreviewStore } from "../../deck-review/store/card-preview-store.ts";
import { platform } from "../../../lib/platform/platform.ts";
import { BrowserPlatform } from "../../../lib/platform/browser/browser-platform.ts";
import { BrowserBackButton } from "../../shared/browser-platform/browser-back-button.tsx";
import { RotateCcwIcon } from "lucide-react";
import { Button } from "../../../ui/button.tsx";
import { t } from "../../../translations/t.ts";
import { CardPreviewFormData } from "./store/card-preview-types.ts";

type Props = {
  form: CardPreviewFormData;
  onBack: () => void;
};

export function CardPreview(props: Props) {
  const { form, onBack } = props;
  const [cardPreviewStore] = useState(() => new CardPreviewStore(form));

  useBackButton(onBack);

  return (
    <div className="flex flex-col items-center justify-center h-screen relative overflow-x-hidden">
      {platform instanceof BrowserPlatform && (
        <div className="absolute top-3 left-3">
          <BrowserBackButton />
        </div>
      )}
      {cardPreviewStore.isOpened && (
        <div className="absolute top-3 right-3 cursor-pointer">
          <RotateCcwIcon
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
        cardOpenedRow={
          <Button
            onClick={() => {
              onBack();
            }}
          >
            {t("quit_card")}
          </Button>
        }
        card={cardPreviewStore}
        onReviewCardWithAnswers={() => {}}
      />
    </div>
  );
}
