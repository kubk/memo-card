import { observer, useLocalObservable } from "mobx-react-lite";
import { CardFormStore } from "./store/card-form-store.ts";
import { assert } from "../../lib/typescript/assert.ts";
import { useMainButton } from "../../lib/telegram/use-main-button.tsx";
import { t } from "../../translations/t.ts";
import { useTelegramProgress } from "../../lib/telegram/use-telegram-progress.tsx";
import { useBackButton } from "../../lib/telegram/use-back-button.tsx";
import { BooleanToggle } from "../../lib/mobx-form/boolean-toggle.ts";
import { Screen } from "../shared/screen.tsx";
import { Label } from "../../ui/label.tsx";
import { HintTransparent } from "../../ui/hint-transparent.tsx";
import { CardRow } from "../../ui/card-row.tsx";
import { RadioSwitcher } from "../../ui/radio-switcher.tsx";
import { SegmentedControl } from "./segmented-control.tsx";
import { CardAnswerType } from "../../../functions/db/custom-types.ts";
import { action } from "mobx";
import { createAnswerForm } from "./store/deck-form-store.ts";
import { css, cx } from "@emotion/css";
import { theme } from "../../ui/theme.tsx";
import { ButtonGrid } from "../../ui/button-grid.tsx";
import { isFormTouched, isFormValid } from "../../lib/mobx-form/form.ts";
import { ButtonSideAligned } from "../../ui/button-side-aligned.tsx";
import React from "react";
import { ValidationError } from "../../ui/validation-error.tsx";
import { showAlert } from "../../lib/telegram/show-alert.ts";
import { WysiwygField } from "../../ui/wysiwyg-field/wysiwig-field.tsx";

type Props = {
  cardFormStore: CardFormStore;
};

export const CardFormView = observer((props: Props) => {
  const { cardFormStore } = props;
  const { cardForm, markCardAsRemoved } = cardFormStore;
  assert(cardForm, "Card should not be empty before editing");

  useMainButton(
    t("save"),
    () => {
      cardFormStore.onSaveCard();
    },
    () => cardFormStore.isSaveCardButtonActive,
  );

  useTelegramProgress(() => cardFormStore.isSending);

  useBackButton(() => {
    cardFormStore.onBackCard();
  });

  const localStore = useLocalObservable(() => ({
    isAdvancedOn: new BooleanToggle(
      cardForm.answerType.value !== "remember" || !!cardForm.example.value,
    ),
  }));

  return (
    <Screen title={cardForm.id ? t("edit_card") : t("add_card")}>
      <Label text={t("card_front_title")} isRequired>
        <WysiwygField field={cardForm.front} />
        <HintTransparent>{t("card_front_side_hint")}</HintTransparent>
      </Label>

      <Label text={t("card_back_title")} isRequired>
        <WysiwygField field={cardForm.back} />
        <HintTransparent>{t("card_back_side_hint")}</HintTransparent>
      </Label>

      <CardRow>
        <span>{t("card_advanced")}</span>
        <RadioSwitcher
          isOn={localStore.isAdvancedOn.value}
          onToggle={localStore.isAdvancedOn.toggle}
        />
      </CardRow>

      {localStore.isAdvancedOn.value && (
        <>
          <Label
            text={
              <span
                className={css({ cursor: "pointer" })}
                onClick={() => {
                  showAlert(t("answer_type_explanation"));
                }}
              >
                {t("answer")}{" "}
                <i
                  className={cx(
                    "mdi mdi-information-outline",
                    css({ color: theme.linkColor }),
                  )}
                />
              </span>
            }
            isPlain
          >
            <SegmentedControl<CardAnswerType>
              onChange={cardForm.answerType.onChange}
              selectedId={cardForm.answerType.value}
              options={[
                {
                  id: "remember",
                  label: t("yes_no"),
                },
                {
                  id: "choice_single",
                  label: t("answer_type_choice"),
                },
              ]}
            />
          </Label>
        </>
      )}

      {localStore.isAdvancedOn.value && (
        <>
          {cardForm.answerType.value === "choice_single" && (
            <>
              {cardForm.answers.value.map((answerForm, index) => (
                <CardRow
                  key={index}
                  onClick={action(() => {
                    cardForm.answerId = answerForm.id;
                    cardForm.answerFormType = "edit";
                  })}
                >
                  <span>{answerForm.text.value}</span>
                  {answerForm.isCorrect.value && (
                    <span>
                      <i
                        className={cx(
                          "mdi mdi-check-circle",
                          css({ color: theme.success }),
                        )}
                      />
                    </span>
                  )}
                </CardRow>
              ))}
              {cardForm.answers.error &&
                isFormTouched({ answers: cardForm.answers }) && (
                  <ValidationError error={cardForm.answers.error} />
                )}
              <CardRow
                onClick={action(() => {
                  const answerForm = createAnswerForm();
                  cardForm.answers.push(answerForm);
                  cardForm.answerId = answerForm.id;
                  cardForm.answerFormType = "new";
                })}
              >
                <span className={css({ color: theme.linkColor })}>
                  <i
                    className={cx("mdi mdi-plus", css({ color: "inherit" }))}
                  />{" "}
                  {t("add_answer")}
                </span>
              </CardRow>
            </>
          )}

          <Label text={t("card_field_example_title")}>
            <WysiwygField field={cardForm.back} />
            <HintTransparent>{t("card_field_example_hint")}</HintTransparent>
          </Label>
        </>
      )}

      <div className={css({ marginTop: 12 })}>
        <ButtonGrid>
          {isFormValid(cardForm) && (
            <ButtonSideAligned
              icon={"mdi-eye-check-outline mdi-24px"}
              outline
              onClick={cardFormStore.isCardPreviewSelected.setTrue}
            >
              {t("card_preview")}
            </ButtonSideAligned>
          )}
          {markCardAsRemoved && cardForm.id && (
            <ButtonSideAligned
              icon={"mdi-delete-outline mdi-24px"}
              outline
              onClick={markCardAsRemoved}
            >
              {t("delete")}
            </ButtonSideAligned>
          )}
        </ButtonGrid>
      </div>
    </Screen>
  );
});
