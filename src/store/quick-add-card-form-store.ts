import { CardFormType, createDeckTitleField } from "./deck-form-store.ts";
import { makeAutoObservable } from "mobx";
import {
  formTouchAll,
  isFormEmpty,
  isFormValid,
} from "../lib/mobx-form/form-has-error.ts";
import { screenStore } from "./screen-store.ts";
import { showConfirm } from "../lib/telegram/show-confirm.ts";

export class QuickAddCardFormStore {
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
