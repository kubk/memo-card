import { observer } from "mobx-react-lite";
import { useAiMassCreationStore } from "./store/ai-mass-creation-store-provider.tsx";
import { assert } from "../../lib/typescript/assert.ts";
import { useState } from "react";
import { createMockCardPreviewForm } from "../deck-form/card-form/create-mock-card-preview-form.ts";
import { CardPreview } from "../deck-form/card-form/card-preview.tsx";

type Props = {
  card: { front: string; back: string; example?: string };
};

export const GeneratedCardPreviewScreen = observer((props: Props) => {
  const store = useAiMassCreationStore();
  assert(store.massCreationForm);
  const { card } = props;
  const [form] = useState(createMockCardPreviewForm(card));

  return (
    <CardPreview
      form={form}
      onBack={() => {
        assert(store.massCreationForm);
        store.massCreationForm.selectedCardIndex.onChange(null);
      }}
    />
  );
});
