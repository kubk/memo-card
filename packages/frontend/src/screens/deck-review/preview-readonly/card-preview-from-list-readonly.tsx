import { useState } from "react";
import { createMockCardPreviewForm } from "../../deck-form/card-form/create-mock-card-preview-form.ts";
import { CardPreview } from "../../deck-form/card-form/card-preview.tsx";
import { DeckCardDbType } from "api";
import { DeckWithCardsWithReviewType } from "../../../store/deck-list-store.ts";

type Props = {
  card: DeckCardDbType;
  deck?: DeckWithCardsWithReviewType;
  onBack: () => void;
};

export function CardPreviewFromListReadonly(props: Props) {
  const { card, onBack, deck } = props;
  const [form] = useState(createMockCardPreviewForm(card, deck));

  return (
    <CardPreview
      form={form}
      onBack={() => {
        onBack();
      }}
    />
  );
}
