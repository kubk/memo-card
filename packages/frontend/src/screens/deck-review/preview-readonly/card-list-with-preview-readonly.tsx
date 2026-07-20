import { DeckCardDbType } from "api";
import { CardListReadonly } from "./card-list-readonly.tsx";
import { DeckWithCardsWithReviewType } from "../../../store/deck-list-store.ts";
import { screenStore } from "../../../store/screen-store.ts";

type Props = {
  onBack: () => void;
  cards: DeckCardDbType[];
  deck: DeckWithCardsWithReviewType;
  subtitle: string;
};

export function CardListWithPreviewReadonly(props: Props) {
  const { deck, onBack, cards, subtitle } = props;

  return (
    <CardListReadonly
      subtitle={subtitle}
      onClick={(card) => {
        screenStore.push({
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
