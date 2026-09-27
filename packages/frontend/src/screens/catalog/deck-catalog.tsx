import { useBackButton } from "../../lib/platform/use-back-button.ts";
import { screenStore } from "../../store/screen-store.ts";
import { useDeckCatalogStore } from "./store/deck-catalog-store-context.tsx";
import { DeckListItemWithDescription } from "../../ui/deck-list-item-with-description.tsx";
import { range } from "../../lib/array/range.ts";
import { CardRowLoading } from "../shared/card-row-loading.tsx";
import { NoDecksMatchingFilters } from "./no-decks-matching-filters.tsx";
import { deckListStore } from "../../store/deck-list-store.ts";
import { DeckAddedLabel } from "./deck-added-label.tsx";
import { t } from "../../translations/t.ts";
import { Screen } from "../shared/screen.tsx";
import { languageFilterToNativeName } from "./translations.ts";
import { useBottomReached } from "../../lib/react/use-bottom-reached.ts";
import { LoaderCircle } from "lucide-react";
import { BottomSheet } from "../../ui/bottom-sheet/bottom-sheet.tsx";
import { RadioList } from "../../ui/radio-list/radio-list.tsx";
import { Skeleton } from "../../ui/skeleton.tsx";

export function DeckCatalog() {
  const store = useDeckCatalogStore();
  const catalogQuery = store.catalogQuery;

  useBottomReached(
    () => {
      catalogQuery.fetchNextPage();
    },
    {
      enabled: catalogQuery.data !== undefined && !catalogQuery.isPending,
    },
  );

  useBackButton(() => {
    screenStore.back();
  });

  return (
    <Screen title={t("deck_catalog")}>
      <div className="flex flex-col gap-1">
        <button
          type="button"
          className={`reset-button flex w-fit max-w-full flex-wrap items-baseline gap-x-1 text-start leading-6 ${store.categoriesQuery.isPending ? "cursor-default" : ""}`}
          disabled={store.categoriesQuery.isPending}
          onClick={() => store.openFilter("category")}
        >
          <span>{t("category")}:</span>
          {store.categoriesQuery.isPending ? (
            <Skeleton className="h-4 w-16 rounded" />
          ) : (
            <span className="text-link">
              {store.categoryOptions.find(
                (option) => option.id === store.categoryId,
              )?.title ?? store.categoryId}
            </span>
          )}
        </button>
        <button
          type="button"
          className="reset-button flex w-fit max-w-full flex-wrap items-baseline gap-x-1 text-start leading-6"
          onClick={() => store.openFilter("language")}
        >
          <span>{t("translated_to")}:</span>
          <span className="text-link">
            {languageFilterToNativeName(store.language)}
          </span>
        </button>
      </div>

      <BottomSheet
        title={t("category")}
        isOpen={store.activeFilter === "category"}
        onClose={store.closeFilter}
      >
        <RadioList
          selectedId={store.categoryId}
          options={store.categoryOptions}
          onChange={store.setCategoryId}
        />
      </BottomSheet>

      <BottomSheet
        title={t("translated_to")}
        isOpen={store.activeFilter === "language"}
        onClose={store.closeFilter}
      >
        <RadioList
          selectedId={store.language}
          options={store.languageOptions}
          onChange={store.setLanguage}
        />
      </BottomSheet>

      {(() => {
        if (catalogQuery.isPending) {
          return range(5).map((i) => <CardRowLoading key={i} />);
        }

        {
          const catalogItems = catalogQuery.items;

          if (catalogQuery.data === undefined) {
            return null;
          }

          if (catalogItems.length === 0) {
            return <NoDecksMatchingFilters />;
          }

          return (
            <>
              {catalogItems.map((item) => {
                const isAdded = deckListStore.isItemAdded({
                  type: item.type,
                  id: item.data.id,
                });

                return (
                  <DeckListItemWithDescription
                    key={item.data.id}
                    titleRightSlot={isAdded ? <DeckAddedLabel /> : undefined}
                    catalogItem={item.data}
                    onClick={() => {
                      if (item.type === "deck") {
                        screenStore.push({
                          type: "deckPreview",
                          deckId: item.data.id,
                        });
                      }
                      if (item.type === "folder") {
                        screenStore.push({
                          type: "folderPreview",
                          folderId: item.data.id,
                          state: { folder: item.data },
                        });
                      }
                    }}
                  />
                );
              })}

              {catalogQuery.isFetchingNextPage ? (
                <div className="flex justify-center py-3">
                  <LoaderCircle size={24} className="animate-spin text-hint" />
                </div>
              ) : null}
            </>
          );
        }
      })()}
    </Screen>
  );
}
