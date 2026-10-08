import { screenStore } from "../../store/screen-store.ts";
import { type DeckListDeck } from "../../store/deck-types.ts";
import { type ActionTileRowItem } from "../../ui/action-tile.tsx";
import { getItemTileActions } from "./library-item-actions.tsx";

type DeckActionTarget = Pick<DeckListDeck, "authorId" | "id" | "shareId">;

export function getDeckTileActions(
  deck: DeckActionTarget,
  canEdit: boolean,
): ActionTileRowItem | null {
  return getItemTileActions({
    type: "deck",
    target: deck,
    onEdit: canEdit
      ? () => {
          screenStore.push({ type: "deckForm", deckId: deck.id });
        }
      : undefined,
  });
}
