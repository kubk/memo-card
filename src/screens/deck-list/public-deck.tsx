import { DeckWithCardsDbType } from "../../../functions/db/deck/decks-with-cards-schema.ts";
import { DeckListItemWithDescription } from "../../ui/deck-list-item-with-description.tsx";
import { deckListStore } from "../../store/deck-list-store.ts";

type Props = { deck: DeckWithCardsDbType };

export function PublicDeck(props: Props) {
  const { deck } = props;

  return (
    <DeckListItemWithDescription
      catalogItem={deck}
      onClick={() => {
        deckListStore.openDeckFromCatalog(deck, false);
      }}
    />
  );
}
