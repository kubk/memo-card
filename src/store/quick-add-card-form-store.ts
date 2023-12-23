import { CardFormType, createCardSideField } from "./deck-form-store.ts";
import { action, makeAutoObservable } from "mobx";
import {
  isFormEmpty,
  isFormTouched,
  isFormValid,
} from "../lib/mobx-form/form-has-error.ts";
import { screenStore } from "./screen-store.ts";
import { showConfirm } from "../lib/telegram/show-confirm.ts";
import { addCardRequest } from "../api/api.ts";
import { assert } from "../lib/typescript/assert.ts";
import { TextField } from "../lib/mobx-form/mobx-form.ts";
import { AddCardRequest } from "../../functions/add-card.ts";
import { deckListStore } from "./deck-list-store.ts";
import { t } from "../translations/t.ts";

export class QuickAddCardFormStore {
  form: CardFormType = {
    back: createCardSideField(""),
    front: createCardSideField(""),
    example: new TextField(""),
  };
  isSending = false;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  onSave() {
    if (!isFormValid(this.form)) {
      return;
    }

    const screen = screenStore.screen;
    assert(screen.type === "cardQuickAddForm");

    this.isSending = true;

    const body: AddCardRequest = {
      deckId: screen.deckId,
      card: {
        back: this.form.back.value,
        front: this.form.front.value,
        example: this.form.example.value,
      },
    };

    return addCardRequest(body)
      .then(() => {
        screenStore.back();
        deckListStore.load();
      })
      .finally(
        action(() => {
          this.isSending = false;
        }),
      );
  }

  async onBack() {
    if (isFormEmpty(this.form) || !isFormTouched(this.form)) {
      screenStore.back();
      return;
    }

    const confirmed = await showConfirm(t("deck_form_quit_card_confirm"));
    if (confirmed) {
      screenStore.back();
    }
  }
}
