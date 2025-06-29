import { DeckCardDbType } from "api";
import { CardListReadonly } from "./card-list-readonly.tsx";
import { DeckWithCardsWithReviewType } from "../../../store/deck-list-store.ts";
import { useScrollToTopOnMount } from "../../../lib/react/use-scroll-to-top-mount.ts";
import { screenStore } from "../../../store/screen-store.ts";

type Props = {
  onBack: () => void;
  cards: DeckCardDbType[];
  deck: DeckWithCardsWithReviewType;
  subtitle: string;
  isFolderPreview?: boolean;
};

export function CardListWithPreviewReadonly(props: Props) {
  const { deck, onBack, cards, subtitle } = props;

  useScrollToTopOnMount();

  return (
    <CardListReadonly
      subtitle={subtitle}
      deck={deck}
      onClick={(card) => {
        screenStore.go({
          type: "cardPreviewId",
          cardId: card.id,
          deckId: deck.id,
        });
      }}
      onBack={onBack}
      cards={cards}
    />
  );
}
