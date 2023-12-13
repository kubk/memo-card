import { observer } from "mobx-react-lite";
import { useBackButton } from "../../lib/telegram/use-back-button.tsx";
import { screenStore } from "../../store/screen-store.ts";
import { css } from "@emotion/css";
import React from "react";
import { useDeckCatalogStore } from "../../store/deck-catalog-store-context.tsx";
import { useMount } from "../../lib/react/use-mount.ts";
import { theme } from "../../ui/theme.tsx";
import { Select } from "../../ui/select.tsx";
import { enumEntries } from "../../lib/typescript/enum-values.ts";
import { LanguageFilter } from "../../store/deck-catalog-store.ts";
import { camelCaseToHuman } from "../../lib/string/camel-case-to-human.ts";
import { DeckListItemWithDescription } from "../../ui/deck-list-item-with-description.tsx";
import { range } from "../../lib/array/range.ts";
import { DeckLoading } from "../deck-list/deck-loading.tsx";
import { NoDecksMatchingFilters } from "./no-decks-matching-filters.tsx";
import { deckListStore } from "../../store/deck-list-store.ts";
import { DeckAddedLabel } from "./deck-added-label.tsx";

export const DeckCatalog = observer(() => {
  const store = useDeckCatalogStore();

  useMount(() => {
    store.load();
  });

  useBackButton(() => {
    screenStore.go({ type: "main" });
  });

  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        gap: 6,
        marginBottom: 16,
      })}
    >
      <h3 className={css({ textAlign: "center" })}>Deck Catalog</h3>
      <div className={css({ display: "flex", gap: 4 })}>
        <div className={css({ color: theme.hintColor })}>Available in:</div>
        <Select<LanguageFilter>
          value={store.filters.language.value}
          onChange={store.filters.language.onChange}
          options={enumEntries(LanguageFilter).map(([name, key]) => ({
            value: key,
            label: name === "Any" ? "Any language" : camelCaseToHuman(name),
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
    </div>
  );
});
