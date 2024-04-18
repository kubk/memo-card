import { CardPreview } from "../deck-form/card-preview.tsx";
import { useState } from "react";
import { createMockCardPreviewForm } from "../deck-form/create-mock-card-preview-form.ts";

export const CardPreviewStory = (props: {
  card: {
    front: string;
    back: string;
    example?: string;
  };
}) => {
  const [form] = useState(createMockCardPreviewForm(props.card));

  return <CardPreview form={form} onBack={() => {}} />;
};
