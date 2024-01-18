import { BooleanToggle } from "../../../lib/mobx-form/boolean-toggle.ts";
import { CardFormType } from "./deck-form-store.ts";

export type CardFormStore = {
  cardForm?: CardFormType | null;
  onSaveCard: () => void;
  onBackCard: () => void;
  isSaveCardButtonActive: boolean;
  isCardPreviewSelected: BooleanToggle;
  isSending: boolean;
  markCardAsRemoved?: () => void;
};
