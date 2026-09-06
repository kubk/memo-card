import { type DeckListDeck } from "../../store/deck-types.ts";
import { LibraryItemActions } from "./library-item-actions.tsx";

type Props = {
  deck: Pick<DeckListDeck, "authorId" | "id" | "shareId">;
  variant: "buttons" | "dropdown";
};

export function DeckActions({ deck, variant }: Props) {
  return (
    <LibraryItemActions type="deck" target={deck} variant={variant} />
  );
}
