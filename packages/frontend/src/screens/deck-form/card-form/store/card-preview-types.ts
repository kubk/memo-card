import { TextField } from "mobx-form-lite";
import { DeckSpeakFieldEnum, SpeakLanguage } from "api";
import { CardFormType } from "../../deck-form/store/deck-form-store.ts";

export type CardInnerScreenType =
  | "cardPreview"
  | "cardType"
  | "example"
  | "aiSpeech"
  | null;

export type LimitedDeckForm = {
  speakingCardsLocale: TextField<SpeakLanguage | null>;
  speakingCardsField: TextField<DeckSpeakFieldEnum | null>;
  cardInputModeId: string | null;
};

export type CardPreviewFormData = {
  cardForm: CardFormType | null | undefined;
  deckForm?: LimitedDeckForm;
};
