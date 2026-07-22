import { useBackButton } from "../../../lib/platform/use-back-button.ts";
import { CardReviewWithControls } from "../../deck-review/card-review-with-controls.tsx";
import { useState } from "react";
import { CardPreviewStore } from "../../deck-review/store/card-preview-store.ts";
import { platform } from "../../../lib/platform/platform.ts";
import { BrowserPlatform } from "../../../lib/platform/browser/browser-platform.ts";
import { BrowserBackButton } from "../../shared/browser-platform/browser-back-button.tsx";
import { PencilIcon, RotateCcwIcon } from "lucide-react";
import { Button } from "../../../ui/button.tsx";
import { t } from "../../../translations/t.ts";
import { CardPreviewFormData } from "./store/card-preview-types.ts";
import { ButtonSideAligned } from "../../../ui/button-side-aligned.tsx";

type Props = {
  form: CardPreviewFormData;
  onBack: () => void;
  onEdit?: () => void;
};

export function CardPreview(props: Props) {
  const { form, onBack, onEdit } = props;
  const [cardPreviewStore] = useState(() => new CardPreviewStore(form));

  useBackButton(onBack);

  return (
    <div className="relative flex h-[calc(var(--tg-viewport-height,100vh)_-_var(--tg-safe-area-inset-top,0px)_-_var(--tg-safe-area-inset-bottom,0px)_-_var(--app-top-offset,0px))] flex-col items-center justify-center overflow-x-hidden">
      <div className="absolute top-3 left-3 flex items-center gap-3">
        {platform instanceof BrowserPlatform && (
          <BrowserBackButton />
        )}
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
        cardFooter={
          onEdit ? (
            <ButtonSideAligned
              align="center"
              icon={<PencilIcon size={24} />}
              outline
              onClick={onEdit}
            >
              {t("edit")}
            </ButtonSideAligned>
          ) : null
        }
        card={cardPreviewStore}
        onReviewCardWithAnswers={() => {}}
      />
    </div>
  );
}
