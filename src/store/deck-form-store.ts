import { TextField } from "../lib/mobx-form/mobx-form.ts";
import { validators } from "../lib/mobx-form/validator.ts";
import { makeAutoObservable } from "mobx";
import { formTouchAll, isFormValid } from "../lib/mobx-form/form-has-error.ts";
import { assert } from "../lib/typescript/assert.ts";
import { upsertDeckRequest } from "../api/api.ts";
import { screenStore } from "./screen-store.ts";
import { deckListStore } from "./deck-list-store.ts";

type CardForm = {
  front: TextField<string>;
  back: TextField<string>;
  id?: number;
};

type DeckFormType = {
  title: TextField<string>;
  description: TextField<string>;
  cards: CardForm[];
};

const createDeckTitleField = (value: string) => {
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

  quitCardForm() {
    assert(this.cardFormIndex !== undefined);
    assert(this.form);
    this.form.cards.splice(this.cardFormIndex, 1);
    this.cardFormIndex = undefined;
  }

  saveDeckForm(onSend?: () => void, onFinish?: () => void) {
    assert(this.form);
    formTouchAll(this.form);
    if (!isFormValid(this.form)) {
      return;
    }
    onSend?.();

    return upsertDeckRequest({
      id: screenStore.deckFormId,
      title: this.form.title.value,
      description: this.form.description.value,
      cards: this.form.cards.map((card) => {
        return {
          id: card.id,
          front: card.front.value,
          back: card.back.value,
        };
      }),
    })
      .then(() => {
        screenStore.navigateToMain();
      })
      .finally(() => {
        onFinish?.();
      });
  }

  get isSaveCardButtonActive() {
    const cardForm = this.cardForm;
    if (!cardForm) {
      return false;
    }

    return isFormValid(cardForm) && cardForm.front.value && cardForm.back.value;
  }
}
