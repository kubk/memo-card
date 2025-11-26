import { useState } from "react";
import { useDeckFormStore } from "./store/deck-form-store-context.tsx";
import { screenStore } from "../../../store/screen-store.ts";
import { useBackButton } from "../../../lib/platform/use-back-button.ts";
import { Input } from "../../../ui/input.tsx";
import { Button } from "../../../ui/button.tsx";
import { t } from "../../../translations/t.ts";
import { Screen } from "../../shared/screen.tsx";
import { removeAllTags } from "../../../lib/sanitize-html/remove-all-tags.ts";
import { CardNumber } from "../../../ui/card-number.tsx";
import { assert } from "api";
import { SearchIcon, XIcon, TrashIcon } from "lucide-react";
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

export const sortOptions: Array<{
  id: string;
  sortBy: CardFilterSortBy;
  direction: CardFilterDirection;
  label: string;
}> = [
  {
    id: "createdAt-desc",
    sortBy: "createdAt",
    direction: "desc",
    label: `${t("card_sort_by_date")} ↓`,
  },
  {
    id: "createdAt-asc",
    sortBy: "createdAt",
    direction: "asc",
    label: `${t("card_sort_by_date")} ↑`,
  },
  {
    id: "frontAlpha-desc",
    sortBy: "frontAlpha",
    direction: "desc",
    label: `${t("card_sort_by_front")} ↓`,
  },
  {
    id: "frontAlpha-asc",
    sortBy: "frontAlpha",
    direction: "asc",
    label: `${t("card_sort_by_front")} ↑`,
  },
  {
    id: "backAlpha-desc",
    sortBy: "backAlpha",
    direction: "desc",
    label: `${t("card_sort_by_back")} ↓`,
  },
  {
    id: "backAlpha-asc",
    sortBy: "backAlpha",
    direction: "asc",
    label: `${t("card_sort_by_back")} ↑`,
  },
];

export function CardList() {
  const deckFormStore = useDeckFormStore();
  const screen = screenStore.screen;
  assert(screen.type === "deckForm");
  const [cardListStore] = useState(() => new CardListStore(deckFormStore));

  useBackButton(() => {
    deckFormStore.quitInnerScreen();
  });

  if (!deckFormStore.deckForm) {
    return null;
  }

  return (
    <Screen title={t("cards")}>
      {deckFormStore.deckForm.cards.length > 1 && (
        <>
          <Input
            field={deckFormStore.cardFilter.text}
            mainIcon={<SearchIcon size={18} />}
            placeholder={t("search_card")}
          />
          <div className="flex justify-between items-center pr-2">
            <div
              onClick={() => cardListStore.isSortSheetOpen.setTrue()}
              className="ml-3 cursor-pointer text-base"
            >
              {t("sort_by")}:{" "}
              <span className="text-link">
                {
                  sortOptions.find(
                    (opt) => opt.id === deckFormStore.currentSortId,
                  )?.label
                }
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
        </>
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
              {removeAllTags(cardForm.front.value)}
            </div>
            <div className="text-hint">
              {removeAllTags(cardForm.back.value)}
            </div>
          </div>
        );
      })}
      {!cardListStore.isSelectionMode.value && (
        <Button
          onClick={() => {
            deckFormStore.openNewCardForm();
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
            title: opt.label,
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
        {cardListStore.isSelectionMode.value && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            style={{ x: "-50%" }}
            className="fixed bottom-4 border left-1/2 rounded-2xl bg-secondary-bg border-t border-bg p-4 z-main-button"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="text-base whitespace-nowrap pl-2">
                {t("selected")}: {cardListStore.selectedCardIds.size}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => cardListStore.deleteSelectedCards()}
                  disabled={cardListStore.selectedCardIds.size === 0}
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    cardListStore.selectedCardIds.size === 0
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-bg active:scale-95",
                  )}
                >
                  <TrashIcon size={20} className="text-danger" />
                </button>
                <button
                  onClick={() => cardListStore.clearSelection()}
                  className="p-2 rounded-lg hover:bg-bg active:scale-95 transition-colors"
                >
                  <XIcon size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Screen>
  );
}
