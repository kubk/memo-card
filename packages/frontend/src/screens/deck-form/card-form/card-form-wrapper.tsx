import { CardPreview } from "./card-preview.tsx";
import { CardExample } from "./card-example.tsx";
import { CardAiSpeech } from "./card-ai-speech.tsx";
import { useCardFormStore } from "./store/card-form-store-context.tsx";
import { ManualCardFormView } from "./manual-card-form-view.tsx";
import { GeneratedCardFormView } from "./generated-card-form-view.tsx";

export function CardFormWrapper() {
  const cardFormStore = useCardFormStore();
  const { cardForm } = cardFormStore;

  if (!cardForm) {
    return null;
  }

  if (cardFormStore.cardInnerScreen.value === "cardPreview") {
    return (
      <CardPreview
        form={cardFormStore}
        onBack={() => cardFormStore.cardInnerScreen.onChange(null)}
      />
    );
  }

  if (cardFormStore.cardInnerScreen.value === "example") {
    return <CardExample />;
  }

  if (cardFormStore.cardInnerScreen.value === "aiSpeech") {
    return <CardAiSpeech />;
  }

  if (cardFormStore.cardInputModeId === null || cardForm.id) {
    return <ManualCardFormView />;
  }

  return <GeneratedCardFormView />;
}
