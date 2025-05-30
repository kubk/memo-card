import { CardFormStoreInterface } from "../deck-form/store/card-form-store-interface.ts";
import { useMainButton } from "../../../lib/platform/use-main-button.ts";
import { t } from "../../../translations/t.ts";
import { useProgress } from "../../../lib/platform/use-progress.tsx";
import { useBackButton } from "../../../lib/platform/use-back-button.ts";
import { userStore } from "../../../store/user-store.ts";
import { Screen } from "../../shared/screen.tsx";
import { Flex } from "../../../ui/flex.tsx";
import { Label } from "../../../ui/label.tsx";
import { FormattingSwitcher } from "./formatting-switcher.tsx";
import { WysiwygField } from "../../../ui/wysiwyg-field/wysiwig-field.tsx";
import { Input } from "../../../ui/input.tsx";
import { HintTransparent } from "../../../ui/hint-transparent.tsx";
import { ListHeader } from "../../../ui/list-header.tsx";
import { List } from "../../../ui/list.tsx";
import { FilledIcon } from "../../../ui/filled-icon.tsx";
import { theme } from "../../../ui/theme.tsx";
import { ListRightText } from "../../../ui/list-right-text.tsx";
import { formatCardType } from "./format-card-type.ts";
import { formTouchAll, isFormValid } from "mobx-form-lite";
import { ButtonSideAligned } from "../../../ui/button-side-aligned.tsx";
import { ButtonGrid } from "../../../ui/button-grid.tsx";
import { CardAnswerErrors } from "./card-answer-errors.tsx";
import { screenStore } from "../../../store/screen-store.ts";
import { assert } from "api";
import { useState } from "react";
import { AiSpeechPreview } from "../../shared/feature-preview/ai-speech-preview.tsx";
import { WithProIcon } from "../../shared/with-pro-icon.tsx";
import { deckListStore } from "../../../store/deck-list-store.ts";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  EyeIcon,
  LayersIcon,
  PlusIcon,
  BotIcon,
  UserIcon,
  CreditCardIcon,
  TrashIcon,
} from "lucide-react";

type PreviewType = "ai_speech";

type Props = { cardFormStore: CardFormStoreInterface };

export function ManualCardFormView(props: Props) {
  const { cardFormStore } = props;
  const { cardForm, markCardAsRemoved } = cardFormStore;
  const [previewType, setPreviewType] = useState<PreviewType | null>(null);
  assert(cardForm, "Card should not be empty before editing");

  useMainButton(t("save"), () => {
    cardFormStore.onSaveCard();
  });

  useProgress(() => cardFormStore.isSending);

  useBackButton(() => {
    const screen = screenStore.screen;
    // Avoid duplicated 'deckForm' in the router history
    if (screen.type === "deckForm" && screen.cardId) {
      screenStore.back();
    }

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
                  icon={<CreditCardIcon size={18} />}
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
                  icon={<LayersIcon size={18} />}
                />
              ),
              text: t("card_answer_type"),
              right: (
                <ListRightText
                  text={formatCardType(cardForm.answerType.value)}
                  chevron
                />
              ),
              onClick: () => {
                cardFormStore.cardInnerScreen.onChange("cardType");
              },
            },

            {
              text: t("ai_cards_title"),
              icon: (
                <FilledIcon
                  backgroundColor={theme.icons.turquoise}
                  icon={<BotIcon size={18} />}
                />
              ),
              onClick: () => {
                userStore.executeViaPaywall("bulk_ai_cards", () => {
                  let deckId: number | undefined = undefined;
                  if (screenStore.screen.type === "cardQuickAddForm") {
                    deckId = screenStore.screen.deckId;
                  } else if (screenStore.screen.type === "deckForm") {
                    deckId = screenStore.screen.deckId;
                  }

                  if (!deckId) return;

                  const deck = deckListStore.searchDeckById(deckId);
                  if (!deck) return;

                  screenStore.go({
                    type: "aiMassCreation",
                    deckId: deckId,
                    deckTitle: deck.name,
                  });
                });
              },
              right: <WithProIcon />,
            },

            {
              icon: (
                <FilledIcon
                  backgroundColor={theme.icons.sea}
                  icon={<UserIcon size={18} />}
                />
              ),
              text: t("ai_speech_title"),
              onClick: () => {
                if (userStore.isPaid) {
                  if (!isFormValid(cardForm)) {
                    formTouchAll(cardForm);
                    return;
                  }
                  cardFormStore.cardInnerScreen.onChange("aiSpeech");
                } else {
                  setPreviewType("ai_speech");
                }
              },
              right: (
                <WithProIcon>
                  {cardForm.options.value?.voice ? (
                    <ListRightText chevron text={t("yes")} />
                  ) : undefined}
                </WithProIcon>
              ),
            },
          ]}
        />
        {cardFormStore.cardForm ? (
          <CardAnswerErrors cardForm={cardFormStore.cardForm} />
        ) : null}
      </div>

      <div className="mt-3">
        <ButtonGrid>
          {cardForm.id && (
            <>
              <ButtonSideAligned
                onClick={cardFormStore.onPreviousCard}
                icon={<ArrowLeftIcon size={24} />}
                disabled={!cardFormStore.isPreviousCardVisible}
                outline
              >
                {t("card_previous")}
              </ButtonSideAligned>
              <ButtonSideAligned
                onClick={cardFormStore.onNextCard}
                icon={<ArrowRightIcon size={24} />}
                disabled={!cardFormStore.isNextCardVisible}
                outline
              >
                {t("card_next")}
              </ButtonSideAligned>
            </>
          )}

          {cardFormStore.cardForm && isFormValid(cardFormStore.cardForm) ? (
            <ButtonSideAligned
              icon={<EyeIcon size={24} />}
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
              icon={<TrashIcon size={24} />}
              outline
              onClick={markCardAsRemoved}
            >
              {t("delete")}
            </ButtonSideAligned>
          )}

          {cardForm.id && (
            <>
              <ButtonSideAligned
                onClick={() => {
                  cardFormStore.onOpenNewFromCard?.();
                }}
                icon={<PlusIcon size={24} />}
                outline
              >
                {t("add_card_short")}
              </ButtonSideAligned>
            </>
          )}
        </ButtonGrid>
      </div>

      <AiSpeechPreview
        showUpgrade
        onClose={() => {
          setPreviewType(null);
        }}
        isOpen={previewType === "ai_speech"}
      />
    </Screen>
  );
}
