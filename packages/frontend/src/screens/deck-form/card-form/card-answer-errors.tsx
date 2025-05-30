import { CardFormType } from "../deck-form/store/deck-form-store.ts";
import { isFormDirty, isFormTouched } from "mobx-form-lite";
import { ValidationError } from "../../../ui/validation-error.tsx";

type Props = {
  cardForm: CardFormType;
};

export function CardAnswerErrors(props: Props) {
  const { cardForm } = props;

  return (
    cardForm.answers.error &&
    (isFormTouched({ answers: cardForm.answers }) ||
      isFormDirty({ answers: cardForm.answers })) && (
      <ValidationError error={cardForm.answers.error} />
    )
  );
}
