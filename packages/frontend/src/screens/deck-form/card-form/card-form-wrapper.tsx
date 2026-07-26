import { CardPreview } from "./card-preview.tsx";
import { CardExample } from "./card-example.tsx";
import { useCardFormStore } from "./store/card-form-store-context.tsx";
import { ManualCardFormView } from "./manual-card-form-view.tsx";

export function CardFormWrapper() {
  const cardFormStore = useCardFormStore();
  const { cardForm } = cardFormStore;

  if (!cardForm) {
    return null;
  }

  if (cardFormStore.cardInnerScreen.value === "cardPreview") {
    return (
      <CardPreview
        form={{
          cardForm,
          speakingCardsLocale: cardFormStore.speakingCardsLocale,
          speakingCardsField: cardFormStore.speakingCardsField,
        }}
        onBack={() => cardFormStore.cardInnerScreen.onChange(null)}
      />
    );
  }

  if (cardFormStore.cardInnerScreen.value === "example") {
    return <CardExample />;
  }

  return <ManualCardFormView />;
}
