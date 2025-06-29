import { cn } from "../../../ui/cn.ts";
import { useDeckFormStore } from "./store/deck-form-store-context.tsx";
import { screenStore } from "../../../store/screen-store.ts";
import { useBackButton } from "../../../lib/platform/use-back-button.ts";
import { Input } from "../../../ui/input.tsx";
import { Button } from "../../../ui/button.tsx";
import { t } from "../../../translations/t.ts";
import { Screen } from "../../shared/screen.tsx";
import { removeAllTags } from "../../../lib/sanitize-html/remove-all-tags.ts";
import { Flex } from "../../../ui/flex.tsx";
import { CardNumber } from "../../../ui/card-number.tsx";
import { assert } from "api";
import { SearchIcon } from "lucide-react";

export function CardList() {
  const deckFormStore = useDeckFormStore();
  const screen = screenStore.screen;
  assert(screen.type === "deckForm");

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
          <Flex ml={12} gap={8}>
            <span>{t("sort_by")}</span>
            {[
              {
                label: t("card_sort_by_date"),
                fieldName: "createdAt" as const,
              },
              {
                label: t("card_sort_by_front"),
                fieldName: "frontAlpha" as const,
              },
              {
                label: t("card_sort_by_back"),
                fieldName: "backAlpha" as const,
              },
            ].map((item, i) => {
              const isSelected =
                deckFormStore.cardFilter.sortBy.value === item.fieldName;

              return (
                <button
                  key={i}
                  className={cn(
                    "reset-button cursor-pointer text-base",
                    isSelected && "text-link",
                  )}
                  onClick={() => {
                    deckFormStore.changeSort(item.fieldName);
                  }}
                >
                  {item.label}{" "}
                  {isSelected ? (deckFormStore.isSortAsc ? "↓" : "↑") : null}
                </button>
              );
            })}
          </Flex>
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
    </Screen>
  );
}
