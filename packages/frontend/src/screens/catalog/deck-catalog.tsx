import { useBackButton } from "../../lib/platform/use-back-button.ts";
import { screenStore } from "../../store/screen-store.ts";
import { useDeckCatalogStore } from "./store/deck-catalog-store-context.tsx";
import { useMount } from "../../lib/react/use-mount.ts";
import { Select } from "../../ui/select.tsx";
import { DeckLanguage } from "./store/deck-catalog-store.ts";
import { DeckListItemWithDescription } from "../../ui/deck-list-item-with-description.tsx";
import { range } from "../../lib/array/range.ts";
import { CardRowLoading } from "../shared/card-row-loading.tsx";
import { NoDecksMatchingFilters } from "./no-decks-matching-filters.tsx";
import { deckListStore } from "../../store/deck-list-store.ts";
import { DeckAddedLabel } from "./deck-added-label.tsx";
import { t, translateCategory } from "../../translations/t.ts";
import { enumValues } from "../../lib/typescript/enum-values.ts";
import { Screen } from "../shared/screen.tsx";
import { Flex } from "../../ui/flex.tsx";
import { languageFilterToNativeName } from "./translations.ts";
import { LanguageCatalogItemAvailableIn } from "api";

export function DeckCatalog() {
  const store = useDeckCatalogStore();

  useMount(() => {
    store.load();
  });

  useBackButton(() => {
    screenStore.back();
  });

  return (
    <Screen title={t("deck_catalog")}>
      <Flex gap={4}>
        <div className="text-hint">{t("category")}</div>
        <Select
          value={store.filters.categoryId.value}
          onChange={store.filters.categoryId.onChange}
          isLoading={store.categoriesRequest.isLoading}
          options={
            store.categoriesRequest.result.status === "success"
              ? [{ value: "", label: t("any_category") }].concat(
                  store.categoriesRequest.result.data.categories.map(
                    (category) => ({
                      value: category.id,
                      label: translateCategory(category.name),
                    }),
                  ),
                )
              : []
          }
        />
      </Flex>

      <Flex gap={4}>
        <div className="text-hint">{t("translated_to")}</div>
        <Select<DeckLanguage>
          value={store.filters.language.value}
          onChange={store.filters.language.onChange}
          options={(
            enumValues(LanguageCatalogItemAvailableIn) as DeckLanguage[]
          )
            .concat(["any"])
            .map((key) => ({
              value: key,
              label: languageFilterToNativeName(key),
            }))}
        />
      </Flex>

      {(() => {
        if (store.catalogRequest.result.status === "loading") {
          return range(5).map((i) => <CardRowLoading key={i} />);
        }

        if (store.catalogRequest.result.status === "success") {
          const filteredCatalogItems = store.filteredCatalogItems;

          if (filteredCatalogItems.length === 0) {
            return <NoDecksMatchingFilters />;
          }

          return filteredCatalogItems.map((item) => {
            const result = deckListStore.isDeckFolderAdded({
              type: item.type,
              id: item.data.id,
            });
            const isAdded = result.isMineDeck || result.isMineFolder;
            const isMineDeck = result.isMineDeck;

            return (
              <DeckListItemWithDescription
                key={item.data.id}
                titleRightSlot={isAdded ? <DeckAddedLabel /> : undefined}
                catalogItem={item.data}
                onClick={() => {
                  if (item.type === "deck") {
                    deckListStore.openDeckFromCatalog(item.data, isMineDeck);
                  }
                  if (item.type === "folder") {
                    deckListStore.openFolderFromCatalog(item.data);
                  }
                }}
              />
            );
          });
        }

        return null;
      })()}
    </Screen>
  );
}
