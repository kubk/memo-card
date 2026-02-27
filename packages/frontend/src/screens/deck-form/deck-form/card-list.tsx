import { useState } from "react";
import { useDeckFormStore } from "./store/deck-form-store-context.tsx";
import { screenStore } from "../../../store/screen-store.ts";
import { useBackButton } from "../../../lib/platform/use-back-button.ts";
import { Input } from "../../../ui/input.tsx";
import { Button } from "../../../ui/button.tsx";
import { t } from "../../../translations/t.ts";
import { Screen } from "../../shared/screen.tsx";
import { CardNumber } from "../../../ui/card-number.tsx";
import {
  SearchIcon,
  XIcon,
  TrashIcon,
  FolderInputIcon,
  CopyPlusIcon,
} from "lucide-react";
import { BottomSheet } from "../../../ui/bottom-sheet/bottom-sheet.tsx";
import { BottomSheetTitle } from "../../../ui/bottom-sheet/bottom-sheet-title.tsx";
import { RadioList } from "../../../ui/radio-list/radio-list.tsx";
import {
  CardFilterSortBy,
  CardFilterDirection,
} from "./store/deck-form-store.ts";
import { CircleCheckbox } from "../../../ui/circle-checkbox.tsx";
import { cn } from "../../../ui/cn.ts";
import { motion, AnimatePresence } from "framer-motion";
import { CardListStore } from "./store/card-list-store.ts";
import { MoveToDeckSelector } from "./move-to-deck-selector.tsx";
import { platform } from "../../../lib/platform/platform.ts";
import { TelegramPlatform } from "../../../lib/platform/telegram/telegram-platform.ts";
import { removeAllTags } from "../../../lib/sanitize-html/remove-all-tags.ts";
import { userStore } from "../../../store/user-store.ts";
import { WithProIcon } from "../../shared/with-pro-icon.tsx";

const sortOptions: Array<{
  id: string;
  sortBy: CardFilterSortBy;
  direction: CardFilterDirection;
  label: () => string;
}> = [
  {
    id: "createdAt-desc",
    sortBy: "createdAt",
    direction: "desc",
    label: () => `${t("card_sort_by_date")} ↓`,
  },
  {
    id: "createdAt-asc",
    sortBy: "createdAt",
    direction: "asc",
    label: () => `${t("card_sort_by_date")} ↑`,
  },
  {
    id: "frontAlpha-desc",
    sortBy: "frontAlpha",
    direction: "desc",
    label: () => `${t("card_sort_by_front")} ↓`,
  },
  {
    id: "frontAlpha-asc",
    sortBy: "frontAlpha",
    direction: "asc",
    label: () => `${t("card_sort_by_front")} ↑`,
  },
  {
    id: "backAlpha-desc",
    sortBy: "backAlpha",
    direction: "desc",
    label: () => `${t("card_sort_by_back")} ↓`,
  },
  {
    id: "backAlpha-asc",
    sortBy: "backAlpha",
    direction: "asc",
    label: () => `${t("card_sort_by_back")} ↑`,
  },
];

export function CardList() {
  const deckFormStore = useDeckFormStore();
  const [cardListStore] = useState(() => new CardListStore(deckFormStore));

  useBackButton(() => {
    screenStore.back();
  });

  if (!deckFormStore.deckForm) {
    return null;
  }

  const hasMultipleDecks =
    cardListStore.moveToDeckStore.availableDecksGrouped.length > 1;
  const noneSelected = cardListStore.selectedCardIds.size === 0;
  const actions = [
    ...(hasMultipleDecks
      ? [
          {
            key: "move",
            icon: FolderInputIcon,
            label: t("move_card_to_deck_title"),
            onClick: () => cardListStore.openMoveSheet(),
            colorClass: "text-button",
          },
        ]
      : []),
    {
      key: "reverse",
      icon: CopyPlusIcon,
      label: t("bulk_create_reverse_cards"),
      onClick: () =>
        userStore.executeViaPaywall("reverse_cards", () =>
          cardListStore.createReverseCards(),
        ),
      colorClass: "text-button",
      right: <WithProIcon />,
    },
    {
      key: "delete",
      icon: TrashIcon,
      label: t("delete"),
      onClick: () => cardListStore.deleteSelectedCards(),
      colorClass: "text-danger",
    },
  ];

  return (
    <Screen title={t("cards")}>
      {deckFormStore.deckForm.cards.length > 1 && (
        <Input
          field={
            {
              value: deckFormStore.cardFilterText,
              onChange: deckFormStore.updateSearchText,
              onBlur: () => {},
              isTouched: false,
              error: undefined,
            } as Parameters<typeof Input>[0]["field"]
          }
          mainIcon={<SearchIcon size={18} />}
          placeholder={t("search_card")}
        />
      )}
      {deckFormStore.filteredCards.length > 0 &&
        deckFormStore.deckForm.cards.length > 1 && (
          <div className="flex justify-between items-center pr-2">
            <div
              onClick={() => cardListStore.isSortSheetOpen.setTrue()}
              className="ml-3 cursor-pointer text-base"
            >
              {t("sort_by")}:{" "}
              <span className="text-link">
                {sortOptions
                  .find((opt) => opt.id === deckFormStore.currentSortId)
                  ?.label()}
              </span>
            </div>
            <div
              className="text-link cursor-pointer"
              onClick={() => {
                if (cardListStore.isSelectionMode.value) {
                  cardListStore.toggleSelectAll();
                } else {
                  cardListStore.isSelectionMode.setTrue();
                }
              }}
            >
              {cardListStore.isSelectionMode.value
                ? cardListStore.areAllCardsSelected
                  ? t("deselect_all")
                  : t("select_all")
                : t("select")}
            </div>
          </div>
        )}
      {deckFormStore.filteredCards.map((cardForm, i) => {
        const isSelected =
          cardForm.id !== undefined &&
          cardListStore.selectedCardIds.has(cardForm.id);

        return (
          <div
            onClick={() => {
              if (
                cardListStore.isSelectionMode.value &&
                cardForm.id !== undefined
              ) {
                platform.haptic("selection");
                cardListStore.toggleCardSelection(cardForm.id);
              } else {
                deckFormStore.editCardFormById(cardForm.id);
              }
            }}
            key={i}
            className="cursor-pointer bg-bg rounded-[12px] p-3 max-h-[120px] overflow-hidden relative"
          >
            {cardListStore.isSelectionMode.value &&
              cardForm.id !== undefined && (
                <div className="absolute top-3 end-3">
                  <CircleCheckbox
                    checked={isSelected}
                    onChange={() => {}}
                    checkedClassName="bg-button"
                  />
                </div>
              )}
            <div>
              <CardNumber number={i + 1} />
              {removeAllTags({ text: cardForm.front.value })}
            </div>
            <div className="text-hint">
              {removeAllTags({ text: cardForm.back.value })}
            </div>
          </div>
        );
      })}
      {deckFormStore.isEmptySearchResults && (
        <div className="text-center text-hint py-4">
          {t("card_search_not_found")}
        </div>
      )}
      {!cardListStore.isSelectionMode.value &&
        !deckFormStore.isEmptySearchResults && (
          <Button
            onClick={() => {
              deckFormStore.navigateToNewCard();
            }}
          >
            {t("add_card")}
          </Button>
        )}

      <BottomSheet
        isOpen={cardListStore.isSortSheetOpen.value}
        onClose={() => cardListStore.isSortSheetOpen.setFalse()}
      >
        <BottomSheetTitle
          title={t("sort_by")}
          onClose={() => cardListStore.isSortSheetOpen.setFalse()}
        />
        <RadioList
          selectedId={deckFormStore.currentSortId}
          options={sortOptions.map((opt) => ({
            id: opt.id,
            title: opt.label(),
          }))}
          onChange={(id) => {
            const selected = sortOptions.find((opt) => opt.id === id);
            if (selected) {
              deckFormStore.setSortByIdAndDirection(
                selected.sortBy,
                selected.direction,
              );
            }
            cardListStore.isSortSheetOpen.setFalse();
          }}
        />
      </BottomSheet>

      <AnimatePresence>
        {cardListStore.isSelectionMode.value && !noneSelected && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            style={{ x: "-50%" }}
            className={cn(
              "fixed bottom-4 left-1/2 rounded-2xl bg-secondary-bg border border-bg z-main-button w-[calc(100vw-2rem)]",
              platform instanceof TelegramPlatform && platform.isIos()
                ? "mb-10"
                : "",
            )}
          >
            <div className="flex items-center justify-between px-4 pt-3 pb-1">
              <span className="text-sm text-hint">
                {t("selected")}: {cardListStore.selectedCardIds.size}
              </span>
              <button
                onClick={() => cardListStore.clearSelection()}
                className="p-1.5 rounded-lg active:scale-95"
              >
                <XIcon size={18} />
              </button>
            </div>
            <div className="flex flex-col pb-1">
              {actions.map((action) => (
                <button
                  key={action.key}
                  onClick={action.onClick}
                  className="flex items-center gap-3 px-4 py-3 text-start"
                >
                  <action.icon size={20} className={action.colorClass} />
                  <span
                    className={cn(
                      "text-sm flex-1",
                      action.key === "delete" ? "text-danger" : "",
                    )}
                  >
                    {action.label}
                  </span>
                  {"right" in action && action.right}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <MoveToDeckSelector store={cardListStore.moveToDeckStore} />
    </Screen>
  );
}
