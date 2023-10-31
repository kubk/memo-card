import { TextField } from "../lib/mobx-form/mobx-form.ts";
import { validators } from "../lib/mobx-form/validator.ts";
import { action, makeAutoObservable } from "mobx";
import {
  formTouchAll,
  isFormEmpty,
  isFormTouched,
  isFormValid,
} from "../lib/mobx-form/form-has-error.ts";
import { assert } from "../lib/typescript/assert.ts";
import { upsertDeckRequest } from "../api/api.ts";
import { screenStore } from "./screen-store.ts";
import { deckListStore } from "./deck-list-store.ts";
import { showConfirm } from "../lib/telegram/show-confirm.ts";
import { showAlert } from "../lib/telegram/show-alert.ts";

export type CardFormType = {
  front: TextField<string>;
  back: TextField<string>;
  id?: number;
};

type DeckFormType = {
  title: TextField<string>;
  description: TextField<string>;
  cards: CardFormType[];
};

export const createDeckTitleField = (value: string) => {
  return new TextField(
    value,
    validators.required("The deck title is required"),
  );
};

const createCardSideField = (value: string) => {
  return new TextField(value, validators.required());
};

export class DeckFormStore {
  cardFormIndex?: number;
  form?: DeckFormType;
  isSending = false;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  loadForm() {
    if (this.form) {
      return;
    }

    if (screenStore.deckFormId) {
      const deck = deckListStore.myDecks.find(
        (myDeck) => myDeck.id === screenStore.deckFormId,
      );
      assert(deck);
      this.form = {
        title: createDeckTitleField(deck.name),
        description: new TextField(deck.description ?? ""),
        cards: deck.deck_card.map((card) => ({
          id: card.id,
          front: createCardSideField(card.front),
          back: createCardSideField(card.back),
        })),
      };
    } else {
      this.form = {
        title: createDeckTitleField(""),
        description: new TextField(""),
        cards: [],
      };
    }
  }

  get cardForm() {
    return this.form !== undefined && this.cardFormIndex !== undefined
      ? this.form.cards[this.cardFormIndex]
      : null;
  }

  openNewCardForm() {
    assert(this.form);
    this.cardFormIndex = this.form.cards.length;
    this.form.cards.push({
      front: createCardSideField(""),
      back: createCardSideField(""),
    });
  }

  editCardForm(i: number) {
    this.cardFormIndex = i;
  }

  saveCardForm() {
    if (!this.isSaveCardButtonActive) {
      return;
    }
    this.cardFormIndex = undefined;
  }

  async onCardBack() {
    assert(this.cardForm);
    if (isFormEmpty(this.cardForm)) {
      this.quitCardForm();
      return;
    }

    const confirmed = await showConfirm("Quit editing card without saving?");
    if (confirmed) {
      this.quitCardForm();
    }
  }

  async onDeckBack() {
    assert(this.form);
    if (isFormEmpty(this.form) || !isFormTouched(this.form)) {
      screenStore.navigateToMain();
      return;
    }

    const confirmed = await showConfirm("Stop adding deck and quit?");
    if (confirmed) {
      screenStore.navigateToMain();
    }
  }

  onDeckSave() {
    assert(this.form);

    if (this.form.cards.length === 0) {
      showAlert("Please add at least 1 card to create a deck");
      return;
    }

    assert(this.form);
    formTouchAll(this.form);
    if (!isFormValid(this.form)) {
      return;
    }
    this.isSending = true;

    return upsertDeckRequest({
      id: screenStore.deckFormId,
      title: this.form.title.value,
      description: this.form.description.value,
      cards: this.form.cards.map((card) => ({
        id: card.id,
        front: card.front.value,
        back: card.back.value,
      })),
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

  quitCardForm() {
    assert(this.cardFormIndex !== undefined);
    assert(this.form);
    this.form.cards.splice(this.cardFormIndex, 1);
    this.cardFormIndex = undefined;
  }

  get isSaveCardButtonActive() {
    const cardForm = this.cardForm;
    if (!cardForm) {
      return false;
    }

    return isFormValid(cardForm) && cardForm.front.value && cardForm.back.value;
  }
}
