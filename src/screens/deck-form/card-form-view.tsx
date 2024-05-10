import { observer } from "mobx-react-lite";
import { CardFormStoreInterface } from "./store/card-form-store-interface.ts";
import { assert } from "../../lib/typescript/assert.ts";
import { useMainButton } from "../../lib/platform/use-main-button.ts";
import { t } from "../../translations/t.ts";
import { useMainButtonProgress } from "../../lib/platform/use-main-button-progress.tsx";
import { useBackButton } from "../../lib/platform/use-back-button.ts";
import { formTouchAll, isFormValid } from "mobx-form-lite";
import { Screen } from "../shared/screen.tsx";
import { Label } from "../../ui/label.tsx";
import { HintTransparent } from "../../ui/hint-transparent.tsx";
import { css } from "@emotion/css";
import { theme } from "../../ui/theme.tsx";
import { ButtonGrid } from "../../ui/button-grid.tsx";
import { ButtonSideAligned } from "../../ui/button-side-aligned.tsx";
import React from "react";
import { WysiwygField } from "../../ui/wysiwyg-field/wysiwig-field.tsx";
import { userStore } from "../../store/user-store.ts";
import { Input } from "../../ui/input.tsx";
import { FormattingSwitcher } from "./formatting-switcher.tsx";
import { Flex } from "../../ui/flex.tsx";
import { List } from "../../ui/list.tsx";
import { FilledIcon } from "../../ui/filled-icon.tsx";
import { ListHeader } from "../../ui/list-header.tsx";
import { formatCardType } from "./format-card-type.ts";
import { ListRightText } from "../../ui/list-right-text.tsx";
import { CardAnswerErrors } from "./card-answer-errors.tsx";
import { boolNarrow } from "../../lib/typescript/bool-narrow.ts";

type Props = {
  cardFormStore: CardFormStoreInterface;
};

export const CardFormView = observer((props: Props) => {
  const { cardFormStore } = props;
  const { cardForm, markCardAsRemoved } = cardFormStore;
  assert(cardForm, "Card should not be empty before editing");

  useMainButton(t("save"), () => {
    cardFormStore.onSaveCard();
  });

  useMainButtonProgress(() => cardFormStore.isSending);

  useBackButton(() => {
    cardFormStore.onBackCard();
  });

  const isCardFormattingOn = userStore.isCardFormattingOn.value;

  return (
    <Screen title={cardForm.id ? t("edit_card") : t("add_card")}>
      <Flex direction={"column"} gap={16}>
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
      </Flex>

      <div>
        <ListHeader text={t("advanced")} />
        <List
          items={[
            {
              icon: (
                <FilledIcon
                  backgroundColor={theme.icons.violet}
                  icon={"mdi-card-text-outline"}
                />
              ),
              text: t("card_field_example_title"),
              onClick: () => {
                cardFormStore.cardInnerScreen.onChange("example");
              },
              right: <ListRightText text={cardForm.example.value} cut />,
            },
            {
              icon: (
                <FilledIcon
                  backgroundColor={theme.icons.blue}
                  icon={"mdi-layers-triple"}
                />
              ),
              text: t("card_answer_type"),
              right: (
                <ListRightText
                  text={formatCardType(cardForm.answerType.value)}
                />
              ),
              onClick: () => {
                cardFormStore.cardInnerScreen.onChange("cardType");
              },
            },
            userStore.canUseAiMassGenerate
              ? {
                  icon: (
                    <FilledIcon
                      backgroundColor={theme.icons.turquoise}
                      icon={"mdi-account-voice"}
                    />
                  ),
                  text: t("ai_speech_title"),
                  onClick: () => {
                    if (!isFormValid(cardForm)) {
                      formTouchAll(cardForm);
                      return;
                    }
                    cardFormStore.cardInnerScreen.onChange("aiSpeech");
                  },
                  right: cardForm.options.value?.voice ? (
                    <ListRightText text={t("yes")} />
                  ) : undefined,
                }
              : undefined,
          ].filter(boolNarrow)}
        />
        {cardFormStore.cardForm ? (
          <CardAnswerErrors cardForm={cardFormStore.cardForm} />
        ) : null}
      </div>

      <div className={css({ marginTop: 12 })}>
        <ButtonGrid>
          {cardForm.id && (
            <>
              <ButtonSideAligned
                onClick={cardFormStore.onPreviousCard}
                icon={"mdi-arrow-left mdi-24px"}
                disabled={!cardFormStore.isPreviousCardVisible}
                outline
              >
                {t("card_previous")}
              </ButtonSideAligned>
              <ButtonSideAligned
                onClick={cardFormStore.onNextCard}
                icon={"mdi-arrow-right mdi-24px"}
                disabled={!cardFormStore.isNextCardVisible}
                outline
              >
                {t("card_next")}
              </ButtonSideAligned>
            </>
          )}

          {cardFormStore.cardForm && isFormValid(cardFormStore.cardForm) ? (
            <ButtonSideAligned
              icon={"mdi-eye-check-outline mdi-24px"}
              outline
              onClick={() => {
                cardFormStore.cardInnerScreen.onChange("cardPreview");
              }}
            >
              {t("card_preview")}
            </ButtonSideAligned>
          ) : null}
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
