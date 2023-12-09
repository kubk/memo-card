import { TextField } from "../lib/mobx-form/mobx-form.ts";
import { validators } from "../lib/mobx-form/validator.ts";
import { action, makeAutoObservable } from "mobx";
import {
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
import { fuzzySearch } from "../lib/string/fuzzy-search.ts";
import {
  DeckSpeakFieldEnum,
  DeckWithCardsDbType,
} from "../../functions/db/deck/decks-with-cards-schema.ts";
import { SpeakLanguageEnum } from "../lib/voice-playback/speak.ts";

export type CardFormType = {
  front: TextField<string>;
  back: TextField<string>;
  example: TextField<string>;
  id?: number;
};

type DeckFormType = {
  id?: number;
  title: TextField<string>;
  description: TextField<string>;
  cards: CardFormType[];
  speakingCardsLocale: TextField<string | null>;
  speakingCardsField: TextField<DeckSpeakFieldEnum | null>;
};

export const createDeckTitleField = (value: string) => {
  return new TextField(
    value,
    validators.required("The deck title is required"),
  );
};

export const createCardSideField = (value: string) => {
  return new TextField(value, validators.required());
};

const createUpdateForm = (
  id: number,
  deck: DeckWithCardsDbType,
): DeckFormType => {
  return {
    id: id,
    title: createDeckTitleField(deck.name),
    description: new TextField(deck.description ?? ""),
    speakingCardsLocale: new TextField(deck.speak_locale),
    speakingCardsField: new TextField(deck.speak_field),
    cards: deck.deck_card.map((card) => ({
      id: card.id,
      front: createCardSideField(card.front),
      back: createCardSideField(card.back),
      example: new TextField(card.example || ""),
    })),
  };
};

const cardFormToApi = (card: CardFormType) => {
  return {
    id: card.id,
    front: card.front.value,
    back: card.back.value,
    example: card.example.value,
  };
};

export type CardFilterSortBy = "createdAt" | "frontAlpha" | "backAlpha";
export type CardFilterDirection = "desc" | "asc";

export class DeckFormStore {
  cardFormIndex?: number;
  cardFormType?: "new" | "edit";
  form?: DeckFormType;
  isSending = false;
  isCardList = false;
  cardFilter = {
    text: new TextField(""),
    sortBy: new TextField<CardFilterSortBy>("createdAt"),
    sortDirection: new TextField<CardFilterDirection>("desc"),
  };

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get deckFormScreen() {
    if (this.cardFormIndex !== undefined) {
      return "cardForm";
    }
    if (this.isCardList) {
      return "cardList";
    }
    return "deckForm";
  }

  loadForm() {
    if (this.form) {
      return;
    }

    const screen = screenStore.screen;
    assert(screen.type === "deckForm");

    if (screen.deckId) {
      const deck = deckListStore.myDecks.find(
        (myDeck) => myDeck.id === screen.deckId,
      );
      assert(deck, "Deck not found in deckListStore");
      this.form = createUpdateForm(screen.deckId, deck);
    } else {
      this.form = {
        title: createDeckTitleField(""),
        description: new TextField(""),
        cards: [],
        speakingCardsLocale: new TextField(null),
        speakingCardsField: new TextField(null),
      };
    }
  }

  get isDeckSaveButtonVisible() {
    return Boolean(
      (this.form?.description.isTouched ||
        this.form?.title.isTouched ||
        this.form?.speakingCardsField.isTouched ||
        this.form?.speakingCardsLocale.isTouched) &&
        this.form?.cards.length > 0,
    );
  }

  goToCardList() {
    if (!this.form) {
      return;
    }
    if (!isFormValid(this.form)) {
      return;
    }
    this.isCardList = true;
  }

  quitCardList() {
    this.isCardList = false;
  }

  get filteredCards() {
    if (!this.form) {
      return [];
    }

    return this.form.cards
      .filter((card) => {
        if (this.cardFilter.text.value) {
          const textFilter = this.cardFilter.text.value.toLowerCase();
          return (
            fuzzySearch(textFilter, card.front.value.toLowerCase()) ||
            fuzzySearch(textFilter, card.back.value.toLowerCase())
          );
        }
        return true;
      })
      .sort((a, b) => {
        const aFront = a.front.value.toLowerCase();
        const bFront = b.front.value.toLowerCase();
        const aBack = a.back.value.toLowerCase();
        const bBack = b.back.value.toLowerCase();

        if (this.cardFilter.sortBy.value === "frontAlpha") {
          return this.cardFilter.sortDirection.value === "desc"
            ? bFront.localeCompare(aFront)
            : aFront.localeCompare(bFront);
        }
        if (this.cardFilter.sortBy.value === "backAlpha") {
          return this.cardFilter.sortDirection.value === "desc"
            ? bBack.localeCompare(aBack)
            : aBack.localeCompare(bBack);
        }
        if (this.cardFilter.sortBy.value === "createdAt") {
          if (this.cardFilter.sortDirection.value === "desc") {
            if (!b.id) return -1;
            if (!a.id) return 1;
            return b.id - a.id;
          }
          if (!b.id) return 1;
          if (!a.id) return -1;
          return a.id - b.id;
        }

        return this.cardFilter.sortBy.value satisfies never;
      });
  }

  changeSort(sortBy: CardFilterSortBy) {
    if (this.cardFilter.sortBy.value === sortBy) {
      this.cardFilter.sortDirection.onChange(this.isSortAsc ? "desc" : "asc");
    } else {
      this.cardFilter.sortBy.onChange(sortBy);
    }
  }

  get isSortAsc() {
    return this.cardFilter.sortDirection.value === "asc";
  }

  toggleIsSpeakingCardEnabled() {
    if (!this.form) return;
    const { speakingCardsLocale, speakingCardsField } = this.form;

    if (speakingCardsLocale.value && speakingCardsField.value) {
      speakingCardsLocale.onChange(null);
      speakingCardsField.onChange(null);
    } else {
      speakingCardsLocale.onChange(SpeakLanguageEnum.USEnglish);
      speakingCardsField.onChange("front");
    }
  }

  get isSpeakingCardEnabled() {
    return (
      !!this.form?.speakingCardsLocale.value &&
      !!this.form?.speakingCardsField.value
    );
  }

  get cardForm() {
    return this.form !== undefined && this.cardFormIndex !== undefined
      ? this.form.cards[this.cardFormIndex]
      : null;
  }

  openNewCardForm() {
    assert(this.form, "openNewCardForm: form is empty");
    if (!isFormValid(this.form)) {
      return;
    }

    this.cardFormIndex = this.form.cards.length;
    this.cardFormType = "new";
    this.form.cards.push({
      front: createCardSideField(""),
      back: createCardSideField(""),
      example: new TextField(""),
    });
  }

  editCardFormByIndex(i: number) {
    this.cardFormIndex = i;
    this.cardFormType = "edit";
  }

  editCardFormById(cardId?: number) {
    if (!cardId || !this.form) {
      return;
    }
    const cardIndex = this.form.cards.findIndex((card) => card.id === cardId);
    if (cardIndex !== -1) {
      this.editCardFormByIndex(cardIndex);
    }
  }

  saveCardForm() {
    if (!this.isSaveCardButtonActive) {
      return;
    }

    this.onDeckSave()?.finally(
      action(() => {
        this.cardFormIndex = undefined;
        this.cardFormType = undefined;
      }),
    );
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

    if (!isFormValid(this.form)) {
      return;
    }
    this.isSending = true;

    // Avoid sending huge collections on every save
    // Only new and touched cards are sent to the server
    const newCards = this.form.cards.filter((card) => !card.id);
    const touchedCards = this.form.cards.filter(
      (card) => !!(card.id && isFormTouched(card)),
    );
    const cardsToSend = newCards.concat(touchedCards).map(cardFormToApi);

    return upsertDeckRequest({
      id: this.form.id,
      title: this.form.title.value,
      description: this.form.description.value,
      cards: cardsToSend,
      speakLocale: this.form.speakingCardsLocale.value,
      speakField: this.form.speakingCardsField.value,
    })
      .then((response) => {
        this.form = createUpdateForm(response.id, response);
        deckListStore.replaceDeck(response)
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

    return Boolean(!cardForm.front.error && !cardForm.back.error);
  }
}
