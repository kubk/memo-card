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
  example: TextField<string>;
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
  cardFormType?: "new" | "edit";
  form?: DeckFormType;
  isSending = false;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  loadForm() {
    if (this.form) {
      return;
    }

    const screen = screenStore.screen;
    assert(screen.type === "deckForm");

    if (screen.deckFormId) {
      const deck = deckListStore.myDecks.find(
        (myDeck) => myDeck.id === screen.deckFormId,
      );
      assert(deck, "Deck not found in deckListStore");
      this.form = {
        title: createDeckTitleField(deck.name),
        description: new TextField(deck.description ?? ""),
        cards: deck.deck_card.map((card) => ({
          id: card.id,
          front: createCardSideField(card.front),
          back: createCardSideField(card.back),
          example: new TextField(card.example || ""),
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
    assert(this.form, "openNewCardForm: form is empty");
    this.cardFormIndex = this.form.cards.length;
    this.cardFormType = "new";
    this.form.cards.push({
      front: createCardSideField(""),
      back: createCardSideField(""),
      example: new TextField(""),
    });
  }

  editCardForm(i: number) {
    this.cardFormIndex = i;
    this.cardFormType = "edit";
  }

  saveCardForm() {
    if (!this.isSaveCardButtonActive) {
      return;
    }
    this.cardFormIndex = undefined;
    this.cardFormType = undefined;
  }

  async onCardBack() {
    assert(this.cardForm, "onCardBack: cardForm is empty");
    if (isFormEmpty(this.cardForm) || !isFormTouched(this.cardForm)) {
      this.quitCardForm();
      return;
    }

    const confirmed = await showConfirm("Quit editing card without saving?");
    if (confirmed) {
      this.quitCardForm();
    }
  }

  async onDeckBack() {
    assert(this.form, "onDeckBack: form is empty");
    if (isFormEmpty(this.form) || !isFormTouched(this.form)) {
      screenStore.back();
      return;
    }

    const confirmed = await showConfirm("Stop adding deck and quit?");
    if (confirmed) {
      screenStore.back();
    }
  }

  onDeckSave() {
    assert(this.form, "onDeckSave: form is empty");

    if (this.form.cards.length === 0) {
      showAlert("Please add at least 1 card to create a deck");
      return;
    }

    formTouchAll(this.form);
    if (!isFormValid(this.form)) {
      return;
    }
    this.isSending = true;

    const screen = screenStore.screen;
    assert(screen.type === "deckForm");

    return upsertDeckRequest({
      id: screen.deckFormId,
      title: this.form.title.value,
      description: this.form.description.value,
      cards: this.form.cards.map((card) => ({
        id: card.id,
        front: card.front.value,
        back: card.back.value,
        example: card.example.value,
      })),
    })
      .then(() => {
        screenStore.go({ type: "main" });
      })
      .finally(
        action(() => {
          this.isSending = false;
        }),
      );
  }

  quitCardForm() {
    assert(
      this.cardFormIndex !== undefined,
      "quitCardForm: cardFormIndex is empty",
    );
    assert(this.form, "quitCardForm: form is empty");
    if (this.cardFormType === "new") {
      this.form.cards.splice(this.cardFormIndex, 1);
    }
    this.cardFormIndex = undefined;
    this.cardFormType = undefined;
  }

  get isSaveCardButtonActive() {
    const cardForm = this.cardForm;
    if (!cardForm) {
      return false;
    }

    return isFormValid(cardForm) && cardForm.front.value && cardForm.back.value;
  }
}
