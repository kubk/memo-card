import { DeckSpeakFieldEnum, SpeakLanguage } from "api";
import { CardFormType } from "../../deck-form/store/deck-form-store.ts";

export type CardInnerScreenType = "cardPreview" | "example" | "aiSpeech" | null;

export type CardPreviewFormData = {
  cardForm: CardFormType | null;
  speakingCardsLocale: SpeakLanguage | null;
  speakingCardsField: DeckSpeakFieldEnum | null;
};
