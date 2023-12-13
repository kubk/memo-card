import { observer } from "mobx-react-lite";
import React from "react";
import { DeckWithCardsDbType } from "../../../functions/db/deck/decks-with-cards-schema.ts";
import { DeckListItemWithDescription } from "../../ui/deck-list-item-with-description.tsx";
import { deckListStore } from "../../store/deck-list-store.ts";

type Props = { deck: DeckWithCardsDbType };

export const PublicDeck = observer((props: Props) => {
  const { deck } = props;

  return (
    <DeckListItemWithDescription
      deck={deck}
      onClick={() => {
        deckListStore.openDeckFromCatalog(deck, false);
      }}
    />
  );
});
