import { CardPreview } from "../deck-form/card-form/card-preview.tsx";
import { useState } from "react";
import { createMockCardPreviewForm } from "../deck-form/card-form/create-mock-card-preview-form.ts";
import { DeckCardDbType } from "api";

export function CardPreviewStory(props: { card: DeckCardDbType }) {
  const [form] = useState(createMockCardPreviewForm(props.card));

  return <CardPreview form={form} onBack={() => {}} />;
}
