import { CardFormType, createDeckTitleField } from "./deck-form-store.ts";
import { action, makeAutoObservable } from "mobx";
import {
  formTouchAll,
  isFormEmpty,
  isFormValid,
} from "../lib/mobx-form/form-has-error.ts";
import { screenStore } from "./screen-store.ts";
import { showConfirm } from "../lib/telegram/show-confirm.ts";
import { addCardRequest } from "../api/api.ts";
import { assert } from "../lib/typescript/assert.ts";

export class QuickAddCardFormStore {
  form: CardFormType = {
    back: createDeckTitleField(""),
    front: createDeckTitleField(""),
  };
  isSending = false;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  onSave() {
    console.log("onSave");
    formTouchAll(this.form);
    if (!isFormValid(this.form)) {
      return;
    }

    assert(screenStore.cardQuickAddDeckId);

    this.isSending = true;

    return addCardRequest({
      deckId: screenStore.cardQuickAddDeckId,
      card: {
        back: this.form.back.value,
        front: this.form.back.value,
      },
    })
      .then(() => {
        screenStore.navigateToMain();
      })
      .finally(
        action(() => {
          this.isSending = false;
        }),
      );
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
