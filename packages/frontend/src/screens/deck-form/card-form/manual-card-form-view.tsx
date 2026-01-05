import { useMainButton } from "../../../lib/platform/use-main-button.ts";
import { t } from "../../../translations/t.ts";
import { useProgress } from "../../../lib/platform/use-progress.tsx";
import { useBackButton } from "../../../lib/platform/use-back-button.ts";
import { userStore } from "../../../store/user-store.ts";
import { Screen } from "../../shared/screen.tsx";
import { Flex } from "../../../ui/flex.tsx";
import { Label } from "../../../ui/label.tsx";
import {
  FormattingSwitcher,
  QuickCardFormattingSwitcher,
} from "./formatting-switcher.tsx";
import { WysiwygField } from "../../../ui/wysiwyg-field/wysiwig-field.tsx";
import { Input } from "../../../ui/input.tsx";
import { HintTransparent } from "../../../ui/hint-transparent.tsx";
import { ListHeader } from "../../../ui/list-header.tsx";
import { List } from "../../../ui/list.tsx";
import { FilledIcon } from "../../../ui/filled-icon.tsx";
import { theme } from "../../../ui/theme.tsx";
import { ListRightText } from "../../../ui/list-right-text.tsx";
import { formatCardType } from "./format-card-type.ts";
import { action } from "mobx";
import { formTouchAll, isFormValid } from "mobx-form-lite";
import { ButtonSideAligned } from "../../../ui/button-side-aligned.tsx";
import { ButtonGrid } from "../../../ui/button-grid.tsx";
import { CardAnswerErrors } from "./card-answer-errors.tsx";
import { screenStore } from "../../../store/screen-store.ts";
import { assert } from "api";
import { WithProIcon } from "../../shared/with-pro-icon.tsx";
import { deckListStore } from "../../../store/deck-list-store.ts";
import { voiceGenerationStore } from "../../../store/voice-generation-store.ts";
import { LoadingSwap } from "../../../ui/loading-swap.tsx";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  EyeIcon,
  LayersIcon,
  PlusIcon,
  BotIcon,
  UserIcon,
  TrashIcon,
  FolderInputIcon,
  BookOpenCheckIcon,
} from "lucide-react";
import { MoveToDeckSelector } from "../deck-form/move-to-deck-selector.tsx";
import { useCardFormStore } from "./store/card-form-store-context.tsx";
import { CardTypeModal } from "./card-type-modal.tsx";
import { CircleCheckbox } from "../../../ui/circle-checkbox.tsx";
import { CardRow } from "../../../ui/card-row.tsx";
import { createAnswerForm } from "../deck-form/store/deck-form-store.ts";
import { platform } from "../../../lib/platform/platform.ts";
import { cn } from "../../../ui/cn.ts";

export function ManualCardFormView() {
  const cardFormStore = useCardFormStore();
  const { cardForm, markCardAsRemoved } = cardFormStore;
  assert(cardForm, "Card should not be empty before editing");

  useMainButton(
    t("save"),
    () => {
      cardFormStore.onSaveCard();
    },
    () => !!cardFormStore.isSaveVisible,
  );

  useProgress(() => cardFormStore.isSending);

  useBackButton(() => {
    cardFormStore.onBackCard();
  });

  const isCardFormattingOn = userStore.isCardFormattingOn.value;
  const isQuizzCardFormattingOn = userStore.isQuizzCardFormattingOn.value;

  const screen = screenStore.screen;
  const deck =
    screen.type === "deckForm" && screen.deckId
      ? deckListStore.searchDeckById(screen.deckId)
      : undefined;

  return (
    <Screen
      title={cardForm.id ? t("edit_card") : t("add_card")}
      subtitle={
        deck && cardForm.id ? (
          <div className="text-center text-sm mb-2">
            <button
              onClick={() => {
                screenStore.backToDeck(deck.id);
              }}
              className="reset-button text-inherit text-link"
            >
              {userStore.isRtl ? `${deck.name} →` : `← ${deck.name}`}
            </button>
          </div>
        ) : undefined
      }
    >
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

        {cardForm.answerType.value === "remember" ? (
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
        ) : (
          <div className="flex w-full flex-col gap-1">
            <Label
              isPlain
              isRequired
              text={formatCardType(cardForm.answerType.value)}
              slotRight={
                cardForm.answers.value.length > 0 ? (
                  <QuickCardFormattingSwitcher />
                ) : undefined
              }
            >
              {" "}
            </Label>
            {cardForm.answers.value.map((answerForm) => {
              const onToggleIsCorrect = action(() => {
                if (!answerForm.isCorrect.value) {
                  cardForm.answers.value.forEach((inner) => {
                    if (inner.id !== answerForm.id) {
                      inner.isCorrect.value = false;
                    }
                  });
                }
                answerForm.isCorrect.toggle();
                platform.haptic("selection");
              });

              const onDelete = action(() => {
                cardForm.answers.removeByCondition(
                  (a) => a.id === answerForm.id,
                );
                platform.haptic("selection");
              });

              return (
                <div
                  key={answerForm.id}
                  className={cn("flex items-start gap-2 relative", {})}
                >
                  <div
                    className={cn("mt-[16px]", {
                      "mt-[5px]": isQuizzCardFormattingOn,
                    })}
                    onClick={onToggleIsCorrect}
                  >
                    <CircleCheckbox
                      checkedClassName="bg-success"
                      checked={answerForm.isCorrect.value}
                      onChange={() => {}}
                    />
                  </div>
                  <div className="flex-1">
                    {isQuizzCardFormattingOn ? (
                      <WysiwygField field={answerForm.text} />
                    ) : (
                      <Input
                        field={answerForm.text}
                        placeholder={t("answer_text")}
                      />
                    )}
                  </div>
                  <button
                    type="button"
                    className={cn("mt-[19px]", {
                      "mt-[7px]": isQuizzCardFormattingOn,
                    })}
                    onClick={onDelete}
                  >
                    <TrashIcon size={18} />
                  </button>
                </div>
              );
            })}

            <CardRow
              className="mt-[3px]"
              onClick={action(() => {
                const answerForm = createAnswerForm();
                cardForm.answers.push(answerForm);
                platform.haptic("selection");
              })}
            >
              <span className="flex items-center gap-2 text-link">
                <PlusIcon size={18} className="text-inherit" />{" "}
                {t("add_answer")}
              </span>
            </CardRow>

            <CardAnswerErrors cardForm={cardForm} />
          </div>
        )}
      </Flex>

      <div>
        <ListHeader text={t("advanced")} />
        <List
          items={[
            {
              icon: (
                <FilledIcon
                  backgroundColor={theme.icons.violet}
                  icon={<BookOpenCheckIcon size={18} />}
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
                cardFormStore.cardTypeModal.setTrue();
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
                  if (screenStore.screen.type === "deckForm") {
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
                userStore.executeViaPaywall("ai_speech", () => {
                  if (!isFormValid(cardForm)) {
                    formTouchAll(cardForm);
                    return;
                  }
                  cardFormStore.cardInnerScreen.onChange("aiSpeech");
                });
              },
              right: (
                <WithProIcon>
                  <LoadingSwap
                    isLoading={
                      cardForm.id
                        ? voiceGenerationStore.isGenerating(cardForm.id)
                        : false
                    }
                  >
                    {cardForm.options.value?.voice ? (
                      <ListRightText chevron text={t("yes")} />
                    ) : undefined}
                  </LoadingSwap>
                </WithProIcon>
              ),
            },
          ]}
        />
      </div>

      <div className="mt-3">
        <ButtonGrid>
          {cardFormStore.isCardNavigationVisible && (
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

          {cardFormStore.isCardPreviewVisible && (
            <ButtonSideAligned
              icon={<EyeIcon size={24} />}
              outline
              onClick={() => {
                cardFormStore.cardInnerScreen.onChange("cardPreview");
              }}
            >
              {t("card_preview")}
            </ButtonSideAligned>
          )}

          {cardForm.id && (
            <>
              <ButtonSideAligned
                onClick={() => {
                  cardFormStore.onOpenNewFromCard();
                }}
                icon={<PlusIcon size={24} />}
                outline
              >
                {t("add_card_short")}
              </ButtonSideAligned>
            </>
          )}

          {cardFormStore.isMoveCardVisible && (
            <ButtonSideAligned
              onClick={() => {
                cardFormStore.openMoveCardSheet();
              }}
              icon={<FolderInputIcon size={24} />}
              outline
            >
              {t("move_card_move")}
            </ButtonSideAligned>
          )}

          {markCardAsRemoved && cardForm.id && (
            <ButtonSideAligned
              icon={<TrashIcon size={24} />}
              outline
              onClick={markCardAsRemoved}
            >
              {t("delete")}
            </ButtonSideAligned>
          )}
        </ButtonGrid>
      </div>

      <MoveToDeckSelector store={cardFormStore.moveToDeckStore} />
      <CardTypeModal />
    </Screen>
  );
}
