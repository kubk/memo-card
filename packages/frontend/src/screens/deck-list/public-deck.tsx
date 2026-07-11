import { RouterOutput } from "api";
import { DeckListItemWithDescription } from "../../ui/deck-list-item-with-description.tsx";
import { platform } from "../../lib/platform/platform.ts";
import { screenStore } from "../../store/screen-store.ts";

type Props = {
  deck: RouterOutput["me"]["info"]["publicDecks"][number];
};

export function PublicDeck(props: Props) {
  const { deck } = props;

  return (
    <DeckListItemWithDescription
      catalogItem={deck}
      onClick={() => {
        platform.haptic("selection");
        screenStore.push({
          type: "deckPreview",
          deckId: deck.id,
          state: { deck },
        });
      }}
    />
  );
}
