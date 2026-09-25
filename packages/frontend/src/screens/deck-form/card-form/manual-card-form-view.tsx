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
import { ListRightText } from "../../../ui/list-right-text.tsx";
import { formatCardType } from "./format-card-type.ts";
import { Button } from "../../../ui/button.tsx";
import { ButtonGrid } from "../../../ui/button-grid.tsx";
import { CardAnswerErrors } from "./card-answer-errors.tsx";
import { screenStore } from "../../../store/screen-store.ts";
import { assert } from "api";
import { deckListStore } from "../../../store/deck-list-store.ts";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BotIcon,
  EyeIcon,
  LayersIcon,
  PlusIcon,
  TrashIcon,
  FolderInputIcon,
  BookOpenCheckIcon,
} from "lucide-react";
import { MoveToDeckSelector } from "../deck-form/move-to-deck-selector.tsx";
import { useCardFormStore } from "./store/card-form-store-context.tsx";
import { CardTypeModal } from "./card-type-modal.tsx";
import { CircleCheckbox } from "../../../ui/circle-checkbox.tsx";
import { CardRow } from "../../../ui/card-row.tsx";
import { cn } from "../../../ui/cn.ts";
import { BackBottomButton } from "../../shared/back-bottom-button.tsx";
import { ChevronIcon } from "../../../ui/chevron-icon.tsx";

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

  const handleBack = () => {
    cardFormStore.onBackCard();
  };

  useBackButton(handleBack);

  const isCardFormattingOn = userStore.isCardFormattingOn.value;
  const isQuizzCardFormattingOn = userStore.isQuizzCardFormattingOn.value;

  const screen = screenStore.screen;
  const deck =
    screen.type === "deckForm" && screen.deckId
      ? deckListStore.searchDeckById(screen.deckId)
      : undefined;

  return (
    <>
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

          {cardForm.answerType.value === "remember" && (
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
          )}
        </Flex>

        <div>
          <ListHeader text={t("advanced")} />
          <List
            items={[
              {
                icon: (
                  <FilledIcon
                    className="bg-icon-violet"
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
                    className="bg-icon-blue"
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
              ...(!userStore.isPaid
                ? [
                    {
                      icon: (
                        <FilledIcon
                          className="bg-icon-turquoise"
                          icon={<BotIcon size={18} />}
                        />
                      ),
                      text: "ChatGPT",
                      right: (
                        <ChevronIcon direction="right" className="text-hint" />
                      ),
                      onClick: () => {
                        screenStore.push({
                          type: "plans",
                          planType: "pro",
                        });
                      },
                    },
                  ]
                : []),
            ]}
          />
        </div>

        {cardForm.answerType.value !== "remember" && (
          <div className="w-full">
            <ListHeader
              text={formatCardType(cardForm.answerType.value)}
              rightSlot={
                <>
                  <span className="pl-1 text-danger">*</span>
                  {cardForm.answers.value.length > 0 ? (
                    <span className="absolute -top-1 end-3 normal-case">
                      <QuickCardFormattingSwitcher />
                    </span>
                  ) : undefined}
                </>
              }
            />
            <div className="flex flex-col gap-1">
              {cardForm.answers.value.map((answerForm) => (
                <div
                  key={answerForm.id}
                  className={cn("flex items-start gap-2 relative", {})}
                >
                  <div
                    className={cn("mt-[16px]", {
                      "mt-[5px]": isQuizzCardFormattingOn,
                    })}
                    onClick={() =>
                      cardFormStore.toggleAnswerCorrect(answerForm.id)
                    }
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
                    onClick={() => cardFormStore.deleteAnswer(answerForm.id)}
                  >
                    <TrashIcon size={18} />
                  </button>
                </div>
              ))}

              <CardRow
                className={cn({
                  "mt-[3px]": cardForm.answers.value.length > 0,
                })}
                onClick={cardFormStore.addAnswer}
              >
                <span className="flex items-center gap-2 text-link">
                  <PlusIcon size={18} className="text-inherit" />{" "}
                  {t("add_answer")}
                </span>
              </CardRow>

              <CardAnswerErrors cardForm={cardForm} />
            </div>
          </div>
        )}

        <div className="mt-3">
          <ButtonGrid>
            {cardFormStore.isCardNavigationVisible && (
              <>
                <Button
                  align="left"
                  onClick={cardFormStore.onPreviousCard}
                  icon={<ArrowLeftIcon size={24} />}
                  disabled={!cardFormStore.isPreviousCardVisible}
                >
                  {t("card_previous")}
                </Button>
                <Button
                  align="left"
                  onClick={cardFormStore.onNextCard}
                  icon={<ArrowRightIcon size={24} />}
                  disabled={!cardFormStore.isNextCardVisible}
                >
                  {t("card_next")}
                </Button>
              </>
            )}

            {cardFormStore.isCardPreviewVisible && (
              <Button
                align="left"
                icon={<EyeIcon size={24} />}
                onClick={() => {
                  cardFormStore.cardInnerScreen.onChange("cardPreview");
                }}
              >
                {t("card_preview")}
              </Button>
            )}

            {cardForm.id && (
              <>
                <Button
                  align="left"
                  onClick={() => {
                    cardFormStore.onOpenNewFromCard();
                  }}
                  icon={<PlusIcon size={24} />}
                >
                  {t("add_card_short")}
                </Button>
              </>
            )}

            {cardFormStore.isMoveCardVisible && (
              <Button
                align="left"
                onClick={() => {
                  cardFormStore.openMoveCardSheet();
                }}
                icon={<FolderInputIcon size={24} />}
              >
                {t("move_card_move")}
              </Button>
            )}

            {markCardAsRemoved && cardForm.id && (
              <Button
                align="left"
                icon={<TrashIcon size={24} />}
                onClick={markCardAsRemoved}
              >
                {t("delete")}
              </Button>
            )}
          </ButtonGrid>
        </div>

        <MoveToDeckSelector store={cardFormStore.moveToDeckStore} />
        <CardTypeModal />
      </Screen>

      <BackBottomButton
        isVisible={Boolean(cardForm.id) && !cardFormStore.isSaveVisible}
        onClick={handleBack}
      />
    </>
  );
}
