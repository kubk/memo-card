import { observer } from "mobx-react-lite";
import { assert } from "../../lib/typescript/assert.ts";
import React from "react";
import { useMainButton } from "../../lib/telegram/use-main-button.tsx";
import { useDeckFormStore } from "../../store/deck-form-store-context.tsx";
import { useBackButton } from "../../lib/telegram/use-back-button.tsx";
import { CardFormView } from "./card-form-view.tsx";
import {
  useTelegramProgress
} from "../../lib/telegram/use-telegram-progress.tsx";

export const CardForm = observer(() => {
  const deckFormStore = useDeckFormStore();
  const cardForm = deckFormStore.cardForm;
  assert(cardForm, "Card should not be empty before editing");

  useMainButton(
    "Save",
    () => {
      deckFormStore.saveCardForm();
    },
    () => deckFormStore.isSaveCardButtonActive,
  );

  useTelegramProgress(() => deckFormStore.isSending)

  useBackButton(() => {
    deckFormStore.onCardBack();
  });

  return <CardFormView cardForm={cardForm} />;
});
