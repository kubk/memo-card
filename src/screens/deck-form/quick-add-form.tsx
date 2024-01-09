import { observer } from "mobx-react-lite";
import { QuickAddCardFormStore } from "./store/quick-add-card-form-store.ts";
import { useMainButton } from "../../lib/telegram/use-main-button.tsx";
import { t } from "../../translations/t.ts";
import { useBackButton } from "../../lib/telegram/use-back-button.tsx";
import { useTelegramProgress } from "../../lib/telegram/use-telegram-progress.tsx";
import { CardFormView } from "./card-form-view.tsx";
import React from "react";

type Props = { quickAddCardStore: QuickAddCardFormStore };

export const QuickAddForm = observer((props: Props) => {
  const { quickAddCardStore } = props;
  useMainButton(t("save"), () => {
    quickAddCardStore.onSave();
  });
  useBackButton(() => {
    quickAddCardStore.onBack();
  });
  useTelegramProgress(() => quickAddCardStore.isSending);

  return (
    <CardFormView
      cardForm={quickAddCardStore.form}
      onPreviewClick={quickAddCardStore.isCardPreviewSelected.setTrue}
    />
  );
});
