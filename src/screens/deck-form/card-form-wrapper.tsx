import { observer } from "mobx-react-lite";
import React from "react";
import { AnswerFormView } from "./answer-form-view.tsx";
import { assert } from "../../lib/typescript/assert.ts";
import { CardFormStoreInterface } from "./store/card-form-store-interface.ts";
import { CardPreview } from "./card-preview.tsx";
import { CardFormView } from "./card-form-view.tsx";

type Props = {
  cardFormStore: CardFormStoreInterface;
};

export const CardFormWrapper = observer((props: Props) => {
  const { cardFormStore } = props;
  const { cardForm } = cardFormStore;
  assert(cardForm, "Card should not be empty before editing");

  if (cardForm.answerId) {
    return <AnswerFormView cardForm={cardForm} />;
  }

  if (cardFormStore.isCardPreviewSelected.value) {
    return (
      <CardPreview
        form={cardFormStore}
        onBack={cardFormStore.isCardPreviewSelected.setFalse}
      />
    );
  }

  return <CardFormView cardFormStore={cardFormStore} />;
});
