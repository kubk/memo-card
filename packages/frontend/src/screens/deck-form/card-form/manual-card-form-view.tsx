import { useMainButton } from "../../../lib/platform/use-main-button.ts";
import { t } from "../../../translations/t.ts";
import { useProgress } from "../../../lib/platform/use-progress.tsx";
import { useBackButton } from "../../../lib/platform/use-back-button.ts";
import { userStore } from "../../../store/user-store.ts";
import { Screen } from "../../shared/screen.tsx";
import { Flex } from "../../../ui/flex.tsx";
import { LabelGroup } from "../../../ui/label-group.tsx";
import {
  FormattingSwitcher,
  QuickCardFormattingSwitcher,
} from "./formatting-switcher.tsx";
import { WysiwygField } from "../../../ui/wysiwyg-field/wysiwig-field.tsx";
import { Input } from "../../../ui/input.tsx";
import { List } from "../../../ui/list.tsx";
import { FilledIcon } from "../../../ui/filled-icon.tsx";
import { ListRightText } from "../../../ui/list-right-text.tsx";
import { formatCardType } from "./format-card-type.ts";
import { ActionTileRow } from "../../../ui/action-tile.tsx";
import { CardAnswerErrors } from "./card-answer-errors.tsx";
import { screenStore } from "../../../store/screen-store.ts";
import { assert } from "api";
import { deckListStore } from "../../../store/deck-list-store.ts";
import {
  Volume2Icon,
  ArrowLeftIcon,
  ArrowRightIcon,
  EllipsisIcon,
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
import { createMcpSettingsEntryItem } from "../../mcp-settings/mcp-settings-entry.tsx";

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

  const moreItems = [
    ...(cardForm.id
      ? [
          {
            icon: <PlusIcon size={20} className="text-hint" />,
            text: t("add_card_short"),
            onClick: () => {
              cardFormStore.onOpenNewFromCard();
            },
          },
        ]
      : []),
    ...(cardFormStore.isMoveCardVisible
      ? [
          {
            icon: <FolderInputIcon size={20} className="text-hint" />,
            text: t("move_card_to_deck_title"),
            onClick: () => {
              cardFormStore.openMoveCardSheet();
            },
          },
        ]
      : []),
    {
      icon: <Volume2Icon size={20} className="text-hint" />,
      text: t("speaking_card"),
      onClick: () => cardFormStore.cardInnerScreen.onChange("speakingCard"),
    },
    ...(cardForm.id
      ? [
          {
            icon: <TrashIcon size={20} className="text-danger" />,
            text: <span className="text-danger">{t("delete")}</span>,
            onClick: markCardAsRemoved,
          },
        ]
      : []),
  ];

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
          <LabelGroup
            title={t("card_front_title")}
            isRequired
            slotRight={<FormattingSwitcher />}
            description={t("card_front_side_hint")}
          >
            {isCardFormattingOn ? (
              <WysiwygField field={cardForm.front} />
            ) : (
              <Input field={cardForm.front} type={"textarea"} rows={2} />
            )}
          </LabelGroup>

          {cardForm.answerType.value === "remember" && (
            <LabelGroup
              title={t("card_back_title")}
              isRequired
              slotRight={<FormattingSwitcher />}
              description={t("card_back_side_hint")}
            >
              {isCardFormattingOn ? (
                <WysiwygField field={cardForm.back} />
              ) : (
                <Input field={cardForm.back} type={"textarea"} rows={2} />
              )}
            </LabelGroup>
          )}
        </Flex>

        <div className="pt-4">
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
              createMcpSettingsEntryItem("bg-icon-turquoise"),
            ]}
          />
        </div>

        {cardForm.answerType.value !== "remember" && (
          <div className="w-full">
            <LabelGroup
              title={formatCardType(cardForm.answerType.value)}
              isRequired
              slotRight={
                cardForm.answers.value.length > 0 ? (
                  <QuickCardFormattingSwitcher />
                ) : undefined
              }
            >
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
            </LabelGroup>
          </div>
        )}

        {cardForm.id && (
          <ActionTileRow
            className="mt-3"
            items={[
              {
                type: "action",
                icon: <ArrowLeftIcon size={24} />,
                text: t("card_previous"),
                onClick: cardFormStore.onPreviousCard,
                disabled: !cardFormStore.isPreviousCardVisible,
              },
              {
                type: "action",
                icon: <EyeIcon size={24} />,
                text: t("card_preview"),
                disabled: !cardFormStore.isCardPreviewVisible,
                onClick: () => {
                  cardFormStore.cardInnerScreen.onChange("cardPreview");
                },
              },
              {
                type: "dropdown",
                icon: <EllipsisIcon size={24} />,
                text: t("more"),
                options: moreItems,
              },
              {
                type: "action",
                icon: <ArrowRightIcon size={24} />,
                text: t("card_next"),
                onClick: cardFormStore.onNextCard,
                disabled: !cardFormStore.isNextCardVisible,
              },
            ]}
          />
        )}

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
