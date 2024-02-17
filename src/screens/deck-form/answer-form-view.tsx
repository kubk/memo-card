import { observer } from "mobx-react-lite";
import { CardFormType } from "./store/deck-form-store.ts";
import { assert } from "../../lib/typescript/assert.ts";
import { Screen } from "../shared/screen.tsx";
import { Label } from "../../ui/label.tsx";
import { Input } from "../../ui/input.tsx";
import { CardRow } from "../../ui/card-row.tsx";
import { RadioSwitcher } from "../../ui/radio-switcher.tsx";
import { HintTransparent } from "../../ui/hint-transparent.tsx";
import React from "react";
import { useBackButton } from "../../lib/telegram/use-back-button.tsx";
import { useMainButton } from "../../lib/telegram/use-main-button.tsx";
import { ButtonGrid } from "../../ui/button-grid.tsx";
import { t } from "../../translations/t.ts";
import { ButtonSideAligned } from "../../ui/button-side-aligned.tsx";
import { v4 } from "uuid";
import { isFormTouched, isFormValid, BooleanField } from "mobx-form-lite";
import { action } from "mobx";

type Props = {
  cardForm: CardFormType;
};

export const AnswerFormView = observer((props: Props) => {
  const { cardForm } = props;

  const answer = cardForm.answers.value.find(
    (answer) => answer.id === cardForm.answerId,
  );
  assert(answer, "Answer not found");

  const closeAnswerForm = action(() => {
    cardForm.answerId = undefined;
  });

  const onSave = action(() => {
    closeAnswerForm();
  });

  const onDelete = action(() => {
    cardForm.answers.removeByCondition(
      (answer) => answer.id === cardForm.answerId,
    );
    closeAnswerForm();
  });

  const onBack = action(async () => {
    if (!answer.text.value) {
      onDelete();
      return;
    }

    closeAnswerForm();
  });

  const onDuplicate = action(() => {
    cardForm.answers.push({
      id: v4(),
      text: answer.text.clone(),
      isCorrect: new BooleanField(false),
    });
    closeAnswerForm();
  });

  const onToggleIsCorrect = action(() => {
    if (!answer.isCorrect.value) {
      cardForm.answers.value.forEach((innerAnswer) => {
        if (innerAnswer.id !== answer.id) {
          innerAnswer.isCorrect.value = false;
        }
      });
    }
    answer.isCorrect.toggle();
  });

  useBackButton(() => {
    onBack();
  });

  useMainButton(
    "Back",
    () => {
      onSave();
    },
    () => isFormTouched(answer) && isFormValid(answer),
  );

  return (
    <Screen
      title={
        cardForm.answerFormType === "new" ? t("add_answer") : t("edit_answer")
      }
    >
      <Label text={t("answer_text")} isRequired>
        <Input field={answer.text} rows={3} type={"textarea"} />
      </Label>

      <CardRow>
        <span>{t("is_correct")}</span>
        <RadioSwitcher
          isOn={answer.isCorrect.value}
          onToggle={onToggleIsCorrect}
        />
      </CardRow>
      <HintTransparent>{t("is_correct_explanation")}</HintTransparent>

      <ButtonGrid>
        {cardForm.answerFormType === "edit" && (
          <ButtonSideAligned
            icon={"mdi-content-duplicate mdi-24px"}
            outline
            onClick={onDuplicate}
          >
            {t("duplicate")}
          </ButtonSideAligned>
        )}

        {cardForm.answerFormType === "edit" && (
          <ButtonSideAligned
            icon={"mdi-delete-circle mdi-24px"}
            outline
            onClick={onDelete}
          >
            {t("delete")}
          </ButtonSideAligned>
        )}
      </ButtonGrid>
    </Screen>
  );
});
