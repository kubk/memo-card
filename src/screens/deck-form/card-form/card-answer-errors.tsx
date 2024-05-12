import { observer } from "mobx-react-lite";
import { CardFormType } from "../deck-form/store/deck-form-store.ts";
import { isFormDirty, isFormTouched } from "mobx-form-lite";
import { ValidationError } from "../../../ui/validation-error.tsx";
import React from "react";

type Props = {
  cardForm: CardFormType;
};

export const CardAnswerErrors = observer((props: Props) => {
  const { cardForm } = props;

  return (
    cardForm.answers.error &&
    (isFormTouched({ answers: cardForm.answers }) ||
      isFormDirty({ answers: cardForm.answers })) && (
      <ValidationError error={cardForm.answers.error} />
    )
  );
});
