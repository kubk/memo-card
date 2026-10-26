import { screenStore } from "../../store/screen-store.ts";
import { type DeckListDeck } from "../../store/deck-types.ts";
import { type ActionTileRowItem } from "../../ui/action-tile.tsx";
import { deckListStore } from "../../store/deck-list-store.ts";
import { copyItemModalStore } from "./copy-item-modal-store.ts";
import { getItemTileActions } from "./library-item-actions.tsx";

type DeckActionTarget = Pick<
  DeckListDeck,
  "authorId" | "id" | "shareId" | "isPublic"
>;

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
      : deck.isPublic && deckListStore.canRemoveDeck(deck)
        ? () => {
            copyItemModalStore.open({ type: "deck", deckId: deck.id });
          }
        : undefined,
  });
}
