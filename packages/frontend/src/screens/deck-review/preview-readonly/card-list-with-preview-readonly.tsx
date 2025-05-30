import { useState } from "react";
import { DeckCardDbType } from "api";
import { CardPreviewFromListReadonly } from "./card-preview-from-list-readonly.tsx";
import { CardListReadonly } from "./card-list-readonly.tsx";
import { DeckWithCardsWithReviewType } from "../../../store/deck-list-store.ts";
import { useScrollToTopOnMount } from "../../../lib/react/use-scroll-to-top-mount.ts";

type Props = {
  onBack: () => void;
  cards: DeckCardDbType[];
  deck?: DeckWithCardsWithReviewType;
  subtitle: string;
  isFolderPreview?: boolean;
};

export function CardListWithPreviewReadonly(props: Props) {
  const { deck, onBack, cards, subtitle } = props;
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);

  useScrollToTopOnMount();

  if (!selectedCardId) {
    return (
      <CardListReadonly
        subtitle={subtitle}
        deck={deck}
        onClick={(card) => {
          setSelectedCardId(card.id);
        }}
        onBack={onBack}
        cards={cards}
      />
    );
  }

  const selectedCard = cards.find((card) => card.id === selectedCardId);
  if (!selectedCard) {
    return null;
  }

  return (
    <CardPreviewFromListReadonly
      card={selectedCard}
      deck={deck}
      onBack={() => {
        setSelectedCardId(null);
      }}
    />
  );
}
