import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import {
  CardFormType,
  createDeckTitleField,
} from "../../store/deck-form-store.ts";
import { CardFormView } from "./card-form-view.tsx";
import { useMainButton } from "../../lib/telegram/use-main-button.tsx";
import { useBackButton } from "../../lib/telegram/use-back-button.tsx";
import {
  formTouchAll,
  isFormEmpty,
  isFormValid,
} from "../../lib/mobx-form/form-has-error.ts";
import { screenStore } from "../../store/screen-store.ts";
import { makeAutoObservable } from "mobx";
import { showConfirm } from "../../lib/telegram/show-confirm.ts";

class QuickAddCardFormStore {
  form: CardFormType = {
    back: createDeckTitleField(""),
    front: createDeckTitleField(""),
  };

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  onSave() {
    formTouchAll(this.form);
    if (!isFormValid(this.form)) {
      return;
    }
  }

  async onBack() {
    if (isFormEmpty(this.form)) {
      screenStore.navigateToMain();
      return;
    }

    const confirmed = await showConfirm("Quit editing card without saving?");
    if (confirmed) {
      screenStore.navigateToMain();
    }
  }
}

export const QuickAddCardForm = observer(() => {
  const [quickAddCardStore] = useState(() => new QuickAddCardFormStore());

  useMainButton("Save", quickAddCardStore.onSave);
  useBackButton(quickAddCardStore.onBack);

  return <CardFormView cardForm={quickAddCardStore.form} />;
});
