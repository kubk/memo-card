import { observer } from "mobx-react-lite";
import { useBackButton } from "../../lib/telegram/use-back-button.tsx";
import { css } from "@emotion/css";
import { CardFormType } from "./store/deck-form-store.ts";
import { CardReviewWithControls } from "../deck-review/card-review-with-controls.tsx";
import { useState } from "react";
import { CardPreviewStore } from "../deck-review/store/card-preview-store.ts";
import { useDeckFormStore } from "./store/deck-form-store-context.tsx";

type Props = {
  form: CardFormType;
  onBack: () => void;
};

export const CardPreview = observer((props: Props) => {
  const { form, onBack } = props;
  const deckFormStore = useDeckFormStore();
  const [cardPreviewStore] = useState(
    () => new CardPreviewStore(form, deckFormStore),
  );

  useBackButton(() => {
    onBack();
  });

  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        position: "relative",
        overflowX: "hidden",
      })}
    >
      {cardPreviewStore.isOpened && (
        <div
          className={css({
            position: "absolute",
            top: 12,
            right: 12,
            cursor: "pointer",
          })}
        >
          <i
            className={"mdi mdi-backup-restore mdi-24px"}
            onClick={() => {
              cardPreviewStore.revert();
            }}
          />
        </div>
      )}

      <CardReviewWithControls
        onWrong={() => {}}
        onCorrect={() => {}}
        onShowAnswer={() => {
          cardPreviewStore.open();
        }}
        card={cardPreviewStore}
        onReviewCardWithAnswers={() => {}}
      />
    </div>
  );
});
