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
import { SearchIcon } from "lucide-react";
import { BottomSheet } from "../../../ui/bottom-sheet/bottom-sheet.tsx";
import { BottomSheetTitle } from "../../../ui/bottom-sheet/bottom-sheet-title.tsx";
import { RadioList } from "../../../ui/radio-list/radio-list.tsx";
import {
  CardFilterSortBy,
  CardFilterDirection,
} from "./store/deck-form-store.ts";
import { makeAutoObservable } from "mobx";
import { BooleanToggle } from "mobx-form-lite";

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

class CardListStore {
  isSortSheetOpen = new BooleanToggle(false);

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  // TODO: add bulk logic
}

export function CardList() {
  const deckFormStore = useDeckFormStore();
  const screen = screenStore.screen;
  assert(screen.type === "deckForm");
  const [cardListStore] = useState(() => new CardListStore());

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
            {/* <div className="text-link">Выбрать</div> */}
          </div>
        </>
      )}
      {deckFormStore.filteredCards.map((cardForm, i) => (
        <div
          onClick={() => {
            deckFormStore.editCardFormById(cardForm.id);
          }}
          key={i}
          className="cursor-pointer bg-bg rounded-[12px] p-3 max-h-[120px] overflow-hidden"
        >
          <div>
            <CardNumber number={i + 1} />
            {removeAllTags(cardForm.front.value)}
          </div>
          <div className="text-hint">{removeAllTags(cardForm.back.value)}</div>
        </div>
      ))}
      <Button
        onClick={() => {
          deckFormStore.openNewCardForm();
        }}
      >
        {t("add_card")}
      </Button>

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
    </Screen>
  );
}
