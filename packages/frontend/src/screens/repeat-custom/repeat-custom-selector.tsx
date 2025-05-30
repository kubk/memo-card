import { RepeatCustomSelectorStore } from "./repeat-custom-selector-store.ts";
import { useMainButton } from "../../lib/platform/use-main-button.ts";
import { Screen } from "../shared/screen.tsx";
import { List } from "../../ui/list.tsx";
import { CircleCheckbox } from "../../ui/circle-checkbox.tsx";
import { deckListStore } from "../../store/deck-list-store.ts";
import { DeckRowWithCardsToReview } from "../shared/deck-row-with-cards-to-review/deck-row-with-cards-to-review.tsx";
import { CardsToReview } from "../../ui/cards-to-review.tsx";
import { ListHeader } from "../../ui/list-header.tsx";
import { CardsToReviewCount } from "../shared/deck-row-with-cards-to-review/cards-to-review-count.tsx";
import { theme } from "../../ui/theme.tsx";
import { cn } from "../../ui/cn.ts";
import { translateReviewCardsLabel } from "./translate-review-cards-label.ts";
import { t } from "../../translations/t.ts";
import { hapticSelection } from "../../lib/platform/telegram/haptics.ts";
import { RadioList } from "../../ui/radio-list/radio-list.tsx";
import { Flex } from "../../ui/flex.tsx";
import { boolNarrow } from "../../lib/typescript/bool-narrow.ts";

type Props = {
  onClick: () => void;
  store: RepeatCustomSelectorStore;
};

export function RepeatCustomSelector({ onClick, store }: Props) {
  useMainButton(
    () => translateReviewCardsLabel(store.customCardsToReviewCount),
    () => {
      onClick();
    },
    () => store.isReviewButtonVisible,
  );

  return (
    <Screen title={t("review_custom")}>
      <div>
        <ListHeader text={t("review_card_type")} />
        <List
          items={[
            {
              icon: (
                <CircleCheckbox
                  checkedClassName={"bg-orange"}
                  checked={store.form.reviewTypes.includes("repeat")}
                  onChange={() => {}}
                />
              ),
              text: (
                <div
                  className={cn({
                    "text-gray-500": !store.form.reviewTypes.includes("repeat"),
                  })}
                >
                  {t("custom_due_cards")}
                </div>
              ),
              onClick: () => {
                store.toggleCardType("repeat");
                hapticSelection();
              },
              right: (
                <CardsToReviewCount
                  items={deckListStore.cardsToReviewCount}
                  color={theme.orange}
                  isDisabled={!store.form.reviewTypes.includes("repeat")}
                />
              ),
            },
            {
              onClick: () => {
                store.toggleCardType("new");
                hapticSelection();
              },
              icon: (
                <CircleCheckbox
                  checkedClassName={"bg-success"}
                  checked={store.form.reviewTypes.includes("new")}
                  onChange={() => {}}
                />
              ),
              text: (
                <div
                  className={cn({
                    "text-gray-500": !store.form.reviewTypes.includes("new"),
                  })}
                >
                  {t("custom_new_cards")}
                </div>
              ),
              right: (
                <CardsToReviewCount
                  isDisabled={!store.form.reviewTypes.includes("new")}
                  items={deckListStore.newCardsCount}
                  color={theme.success}
                />
              ),
            },
          ]}
        />
      </div>

      <div>
        <ListHeader text={t("decks")} />
        {deckListStore.myDeckItems.map((listItem) => {
          return (
            <div key={listItem.id} className={"flex flex-col gap-2 pb-2"}>
              <DeckRowWithCardsToReview
                slotLeft={
                  <div className={"mr-2"}>
                    <CircleCheckbox
                      checkedClassName={"bg-button"}
                      checked={store.isListRootItemOn(listItem)}
                      onChange={() => {}}
                    />
                  </div>
                }
                onClick={() => {
                  hapticSelection();
                  store.toggleListRoot(listItem);
                }}
                item={listItem}
              />
              {listItem.type === "folder" && (
                <div className="ml-6">
                  <List
                    items={listItem.decks.map((deck) => {
                      return {
                        onClick: () => {
                          hapticSelection();
                          store.toggleDeckId(deck.id);
                        },
                        text: deck.name,
                        icon: (
                          <CircleCheckbox
                            checkedClassName={"bg-button"}
                            checked={store.form.selectedDecksIds.includes(
                              deck.id,
                            )}
                            onChange={() => {}}
                          />
                        ),
                        right: <CardsToReview item={deck} />,
                      };
                    })}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div>
        <ListHeader text={t("card_order")} />
        <RadioList
          selectedId={store.sortingType.value}
          options={[
            {
              id: "none" as const,
              title: (
                <Flex direction={"column"}>
                  <div>{t("card_order_none")}</div>
                  <div className="text-sm text-hint pr-4">
                    {t("card_order_none_hint")}
                  </div>
                </Flex>
              ),
            },
            store.form.reviewTypes.includes("new")
              ? {
                  id: "review-first" as const,
                  title: (
                    <Flex direction={"column"}>
                      <div>{t("card_order_review_first")}</div>
                      <div className="text-sm text-hint pr-4">
                        {t("card_order_review_first_hint")}
                      </div>
                    </Flex>
                  ),
                }
              : null,
            {
              id: "random" as const,
              title: (
                <Flex direction={"column"}>
                  <div>{t("card_order_random")}</div>
                  <div className="text-sm text-hint pr-4">
                    {t("card_order_random_hint")}
                  </div>
                </Flex>
              ),
            },
          ].filter(boolNarrow)}
          onChange={(sortingType) => {
            store.sortingType.onChange(sortingType);
            hapticSelection();
          }}
        />
      </div>
    </Screen>
  );
}
