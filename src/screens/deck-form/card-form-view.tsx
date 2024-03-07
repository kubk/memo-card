import { observer, useLocalObservable } from "mobx-react-lite";
import { CardFormStoreInterface } from "./store/card-form-store-interface.ts";
import { assert } from "../../lib/typescript/assert.ts";
import { useMainButton } from "../../lib/telegram/use-main-button.tsx";
import { t } from "../../translations/t.ts";
import { useTelegramProgress } from "../../lib/telegram/use-telegram-progress.tsx";
import { useBackButton } from "../../lib/telegram/use-back-button.tsx";
import { BooleanToggle, isFormTouched, isFormValid } from "mobx-form-lite";
import { Screen } from "../shared/screen.tsx";
import { Label } from "../../ui/label.tsx";
import { HintTransparent } from "../../ui/hint-transparent.tsx";
import { CardRow } from "../../ui/card-row.tsx";
import { RadioSwitcher } from "../../ui/radio-switcher.tsx";
import { AppRoot, SegmentedControl } from "@xelene/tgui";
import { action } from "mobx";
import { createAnswerForm } from "./store/deck-form-store.ts";
import { css, cx } from "@emotion/css";
import { theme } from "../../ui/theme.tsx";
import { ButtonGrid } from "../../ui/button-grid.tsx";
import { ButtonSideAligned } from "../../ui/button-side-aligned.tsx";
import React from "react";
import { ValidationError } from "../../ui/validation-error.tsx";
import { showAlert } from "../../lib/telegram/show-alert.ts";
import { WysiwygField } from "../../ui/wysiwyg-field/wysiwig-field.tsx";
import { userStore } from "../../store/user-store.ts";
import { Input } from "../../ui/input.tsx";
import { FormattingSwitcher } from "./formatting-switcher.tsx";

type Props = {
  cardFormStore: CardFormStoreInterface;
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

  const isCardFormattingOn = userStore.isCardFormattingOn.value;

  return (
    <Screen title={cardForm.id ? t("edit_card") : t("add_card")}>
      <div
        className={css({
          display: "flex",
          flexDirection: "column",
          gap: 16,
        })}
      >
        <Label
          text={t("card_front_title")}
          isPlain
          isRequired
          slotRight={<FormattingSwitcher />}
        >
          {isCardFormattingOn ? (
            <WysiwygField field={cardForm.front} />
          ) : (
            <Input field={cardForm.front} type={"textarea"} rows={2} />
          )}
          <HintTransparent>{t("card_front_side_hint")}</HintTransparent>
        </Label>

        <Label
          text={t("card_back_title")}
          isPlain
          isRequired
          slotRight={<FormattingSwitcher />}
        >
          {isCardFormattingOn ? (
            <WysiwygField field={cardForm.back} />
          ) : (
            <Input field={cardForm.back} type={"textarea"} rows={2} />
          )}
          <HintTransparent>{t("card_back_side_hint")}</HintTransparent>
        </Label>
      </div>

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
            <AppRoot>
              <SegmentedControl>
                <SegmentedControl.Item
                  selected={cardForm.answerType.value === "remember"}
                  key={"remember"}
                  onClick={() => {
                    cardForm?.answerType.onChange("remember");
                  }}
                >
                  {t("yes_no")}
                </SegmentedControl.Item>
                <SegmentedControl.Item
                  selected={cardForm.answerType.value === "choice_single"}
                  key={"choice_single"}
                  onClick={() => {
                    cardForm?.answerType.onChange("choice_single");
                  }}
                >
                  {t("answer_type_choice")}
                </SegmentedControl.Item>
              </SegmentedControl>
            </AppRoot>
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

          <Label
            isPlain
            text={t("card_field_example_title")}
            slotRight={<FormattingSwitcher />}
          >
            {isCardFormattingOn ? (
              <WysiwygField field={cardForm.example} />
            ) : (
              <Input field={cardForm.example} type={"textarea"} rows={2} />
            )}
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
