import { DeckWithCardsDbType } from "api";
import { DeckListItemWithDescription } from "../../ui/deck-list-item-with-description.tsx";
import { deckListStore } from "../../store/deck-list-store.ts";
import { platform } from "../../lib/platform/platform.ts";

type Props = { deck: DeckWithCardsDbType };

export function PublicDeck(props: Props) {
  const { deck } = props;

  return (
    <DeckListItemWithDescription
      catalogItem={deck}
      onClick={() => {
        platform.haptic("selection");
        deckListStore.openDeckFromCatalog(deck, false);
      }}
    />
  );
}
