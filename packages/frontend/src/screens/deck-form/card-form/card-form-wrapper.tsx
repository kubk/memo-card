import { AnswerFormView } from "./answer-form-view.tsx";
import { CardFormStoreInterface } from "../deck-form/store/card-form-store-interface.ts";
import { CardPreview } from "./card-preview.tsx";
import { CardFormView } from "./card-form-view.tsx";
import { CardExample } from "./card-example.tsx";
import { CardType } from "./card-type.tsx";
import { CardAiSpeech } from "./card-ai-speech.tsx";
import { assert } from "api";

type Props = {
  cardFormStore: CardFormStoreInterface;
};

export function CardFormWrapper(props: Props) {
  const { cardFormStore } = props;
  const { cardForm } = cardFormStore;
  assert(cardForm, "Card should not be empty before editing");

  if (cardForm.answerId) {
    return <AnswerFormView cardForm={cardForm} />;
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
    return (
      <CardExample
        cardForm={cardForm}
        onBack={() => cardFormStore.cardInnerScreen.onChange(null)}
      />
    );
  }

  if (cardFormStore.cardInnerScreen.value === "cardType") {
    return (
      <CardType
        cardForm={cardForm}
        onBack={() => cardFormStore.cardInnerScreen.onChange(null)}
      />
    );
  }

  if (cardFormStore.cardInnerScreen.value === "aiSpeech") {
    assert(cardFormStore.deckForm, "Deck form should be available");
    return (
      <CardAiSpeech
        cardForm={cardForm}
        deckForm={cardFormStore.deckForm}
        onBack={() => cardFormStore.cardInnerScreen.onChange(null)}
      />
    );
  }

  return <CardFormView cardFormStore={cardFormStore} />;
}
