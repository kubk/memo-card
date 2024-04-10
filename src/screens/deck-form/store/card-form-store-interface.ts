import { CardFormType } from "./deck-form-store.ts";
import { BooleanToggle, TextField } from "mobx-form-lite";
import { DeckSpeakFieldEnum } from "../../../../functions/db/deck/decks-with-cards-schema.ts";

export interface CardFormStoreInterface {
  cardForm?: CardFormType | null;
  onSaveCard: () => void;
  onBackCard: () => void;
  isCardPreviewSelected: BooleanToggle;
  isSending: boolean;
  markCardAsRemoved?: () => void;

  form?: {
    speakingCardsLocale: TextField<string | null>;
    speakingCardsField: TextField<DeckSpeakFieldEnum | null>;
  };

  // Navigation next and previous card
  isPreviousCardVisible?: boolean;
  isNextCardVisible?: boolean;
  onPreviousCard?: () => void;
  onNextCard?: () => void;
}
