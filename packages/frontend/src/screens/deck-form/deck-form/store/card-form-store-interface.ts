import { CardFormType } from "./deck-form-store.ts";
import { TextField } from "mobx-form-lite";
import { DeckSpeakFieldEnum, SpeakLanguage } from "api";

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

export interface CardFormStoreInterface {
  cardForm?: CardFormType | null;
  onSaveCard: () => void;
  onBackCard: () => void;
  cardInnerScreen: TextField<CardInnerScreenType>;
  isSending: boolean;
  markCardAsRemoved?: () => void;

  deckForm?: LimitedDeckForm;

  // Navigation next and previous card
  isPreviousCardVisible?: boolean;
  isNextCardVisible?: boolean;
  onPreviousCard?: () => void;
  onNextCard?: () => void;

  onOpenNewFromCard?: () => void;
}
