import { observer } from "mobx-react-lite";
import { useBackButton } from "../../lib/telegram/use-back-button.tsx";
import { screenStore } from "../../store/screen-store.ts";
import { css } from "@emotion/css";
import React from "react";
import { useDeckCatalogStore } from "./store/deck-catalog-store-context.tsx";
import { useMount } from "../../lib/react/use-mount.ts";
import { theme } from "../../ui/theme.tsx";
import { Select } from "../../ui/select.tsx";
import {
  DeckLanguage,
  languageFilterToNativeName,
} from "./store/deck-catalog-store.ts";
import { DeckListItemWithDescription } from "../../ui/deck-list-item-with-description.tsx";
import { range } from "../../lib/array/range.ts";
import { DeckLoading } from "../deck-list/deck-loading.tsx";
import { NoDecksMatchingFilters } from "./no-decks-matching-filters.tsx";
import { deckListStore } from "../../store/deck-list-store.ts";
import { DeckAddedLabel } from "./deck-added-label.tsx";
import { t, translateCategory } from "../../translations/t.ts";
import { enumValues } from "../../lib/typescript/enum-values.ts";
import { Screen } from "../shared/screen.tsx";

export const DeckCatalog = observer(() => {
  const store = useDeckCatalogStore();

  useMount(() => {
    store.load();
  });

  useBackButton(() => {
    screenStore.go({ type: "main" });
  });

  return (
    <Screen title={t("deck_catalog")}>
      <div className={css({ display: "flex", gap: 4 })}>
        <div className={css({ color: theme.hintColor })}>{t("category")}</div>
        <Select
          value={store.filters.categoryId.value}
          onChange={store.filters.categoryId.onChange}
          isLoading={store.categories?.state === "pending"}
          options={
            store.categories?.state === "fulfilled"
              ? [{ value: "", label: t("any_category") }].concat(
                  store.categories.value.categories.map((category) => ({
                    value: category.id,
                    label: translateCategory(category.name),
                  })),
                )
              : []
          }
        />
      </div>

      <div className={css({ display: "flex", gap: 4 })}>
        <div className={css({ color: theme.hintColor })}>
          {t("translated_to")}
        </div>
        <Select<DeckLanguage>
          value={store.filters.language.value}
          onChange={store.filters.language.onChange}
          options={enumValues(DeckLanguage).map((key) => ({
            value: key,
            label: languageFilterToNativeName(key),
          }))}
        />
      </div>

      {(() => {
        if (store.decks?.state === "pending") {
          return range(5).map((i) => <DeckLoading key={i} />);
        }

        if (store.decks?.state === "fulfilled") {
          const filteredDecks = store.filteredDecks;

          if (filteredDecks.length === 0) {
            return <NoDecksMatchingFilters />;
          }

          const myDeckIds = deckListStore.myDecks.map((deck) => deck.id);

          return filteredDecks.map((deck) => {
            const isMine = myDeckIds.includes(deck.id);

            return (
              <DeckListItemWithDescription
                key={deck.id}
                titleRightSlot={isMine ? <DeckAddedLabel /> : undefined}
                deck={deck}
                onClick={() => {
                  deckListStore.openDeckFromCatalog(deck, isMine);
                }}
              />
            );
          });
        }

        return null;
      })()}
    </Screen>
  );
});
