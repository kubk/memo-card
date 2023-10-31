import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { CardFormView } from "./card-form-view.tsx";
import { useMainButton } from "../../lib/telegram/use-main-button.tsx";
import { useBackButton } from "../../lib/telegram/use-back-button.tsx";
import { QuickAddCardFormStore } from "../../store/quick-add-card-form-store.ts";
import { useTelegramProgress } from "../../lib/telegram/use-telegram-progress.tsx";

export const QuickAddCardForm = observer(() => {
  const [quickAddCardStore] = useState(() => new QuickAddCardFormStore());

  useMainButton("Save", quickAddCardStore.onSave);
  useBackButton(quickAddCardStore.onBack);
  useTelegramProgress(() => quickAddCardStore.isSending);

  return <CardFormView cardForm={quickAddCardStore.form} />;
});
