import { BooleanToggle } from "../../../lib/mobx-form/boolean-toggle.ts";
import { CardFormType } from "./deck-form-store.ts";
import { TextField } from "../../../lib/mobx-form/text-field.ts";
import { DeckSpeakFieldEnum } from "../../../../functions/db/deck/decks-with-cards-schema.ts";

export type CardFormStoreInterface = {
  cardForm?: CardFormType | null;
  onSaveCard: () => void;
  onBackCard: () => void;
  isSaveCardButtonActive: boolean;
  isCardPreviewSelected: BooleanToggle;
  isSending: boolean;
  markCardAsRemoved?: () => void;

  form?: {
    speakingCardsLocale: TextField<string | null>;
    speakingCardsField: TextField<DeckSpeakFieldEnum | null>;
  };
};
