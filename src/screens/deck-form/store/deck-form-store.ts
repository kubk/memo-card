import {
  BooleanField,
  formTouchAll,
  isFormDirty,
  isFormEmpty,
  isFormTouched,
  isFormValid,
  ListField,
  TextField,
  validators,
} from "mobx-form-lite";
import { action, makeAutoObservable, runInAction } from "mobx";
import { assert } from "../../../lib/typescript/assert.ts";
import { upsertDeckRequest } from "../../../api/api.ts";
import { screenStore } from "../../../store/screen-store.ts";
import { deckListStore } from "../../../store/deck-list-store.ts";
import { showConfirm } from "../../../lib/telegram/show-confirm.ts";
import { fuzzySearch } from "../../../lib/string/fuzzy-search.ts";
import {
  DeckCardDbType,
  DeckCardOptionsDbType,
  DeckSpeakFieldEnum,
  DeckWithCardsDbType,
} from "../../../../functions/db/deck/decks-with-cards-schema.ts";
import { SpeakLanguageEnum } from "../../../lib/voice-playback/speak.ts";
import { t } from "../../../translations/t.ts";
import { CardAnswerType } from "../../../../functions/db/custom-types.ts";
import { v4 } from "uuid";
import {
  CardFormStoreInterface,
  CardInnerScreenType,
} from "./card-form-store-interface.ts";
import { UpsertDeckRequest } from "../../../../functions/upsert-deck.ts";
import { UnwrapArray } from "../../../lib/typescript/unwrap-array.ts";
import { RequestStore } from "../../../lib/mobx-request/request-store.ts";
import { notifyError } from "../../shared/snackbar/snackbar.tsx";

export type CardAnswerFormType = {
  id: string;
  text: TextField<string>;
  isCorrect: BooleanField;
};

export type CardFormType = {
  front: TextField<string>;
  back: TextField<string>;
  example: TextField<string>;
  answerType: TextField<CardAnswerType>;
  answers: ListField<CardAnswerFormType>;
  answerId?: string;
  answerFormType?: "new" | "edit";
  id?: number;
  options: DeckCardOptionsDbType;
};

type DeckFormType = {
  id?: number;
  title: TextField<string>;
  description: TextField<string>;
  cards: CardFormType[];
  speakingCardsLocale: TextField<string | null>;
  speakingCardsField: TextField<DeckSpeakFieldEnum | null>;
  folderId?: number;
  cardsToRemoveIds: number[];
};

export const createDeckTitleField = (value: string) => {
  return new TextField(value, {
    validate: validators.required(t("validation_deck_title")),
  });
};

export const createCardSideField = (value: string) => {
  return new TextField(value, {
    validate: validators.required(t("validation_required")),
  });
};

export const createAnswerForm = () => {
  return {
    id: v4(),
    text: new TextField("", {
      validate: validators.required(t("validation_required")),
    }),
    isCorrect: new BooleanField(false),
  };
};

export const createAnswerListField = (
  answers: CardAnswerFormType[],
  getCardForm: () => CardFormType | null,
) => {
  return new ListField<CardAnswerFormType>(answers, {
    validate: (value) => {
      const cardForm = getCardForm();

      if (!cardForm || cardForm.answerType.value !== "choice_single") {
        return;
      }

      if (value.length > 0) {
        if (value.every((item) => !item.isCorrect.value)) {
          return t("validation_answer_at_least_one_correct");
        }
      }

      if (value.length === 0) {
        return t("validation_at_least_one_answer_required");
      }
    },
  });
};

export const createAnswerTypeField = (card?: DeckCardDbType) => {
  return new TextField<CardAnswerType>(card ? card.answer_type : "remember");
};

const createUpdateForm = (
  id: number,
  deck: DeckWithCardsDbType,
  getCardForm: () => CardFormType | null,
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
      answerType: createAnswerTypeField(card),
      options: card.options,
      answers: createAnswerListField(
        card.answers
          ? card.answers.map((answer) => ({
              id: answer.id,
              text: new TextField(answer.text),
              isCorrect: new BooleanField(answer.isCorrect),
            }))
          : [],
        getCardForm,
      ),
    })),
    cardsToRemoveIds: [],
  };
};

const cardFormToApi = (
  card: CardFormType,
): UnwrapArray<UpsertDeckRequest["cards"]> => {
  return {
    id: card.id,
    front: card.front.value,
    back: card.back.value,
    example: card.example.value,
    answerType: card.answerType.value,
    answers: card.answers.value.map((answer) => ({
      id: answer.id,
      text: answer.text.value,
      isCorrect: answer.isCorrect.value,
    })),
  };
};

export type CardFilterSortBy = "createdAt" | "frontAlpha" | "backAlpha";
export type CardFilterDirection = "desc" | "asc";

export class DeckFormStore implements CardFormStoreInterface {
  cardFormIndex?: number;
  cardFormType?: "new" | "edit";
  form?: DeckFormType;
  upsertDeckRequest = new RequestStore(upsertDeckRequest);
  cardInnerScreen = new TextField<CardInnerScreenType>(null);
  deckInnerScreen?: "cardList" | "speakingCards";
  cardFilter = {
    text: new TextField(""),
    sortBy: new TextField<CardFilterSortBy>("createdAt"),
    sortDirection: new TextField<CardFilterDirection>("desc"),
  };

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get isSending() {
    return this.upsertDeckRequest.isLoading;
  }

  get deckFormScreen() {
    if (this.cardFormIndex !== undefined) {
      return "cardForm";
    }
    if (this.deckInnerScreen) {
      return this.deckInnerScreen;
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
      const deck = deckListStore.searchDeckById(screen.deckId);
      assert(deck, "Deck not found in deckListStore");
      this.form = createUpdateForm(screen.deckId, deck, () => this.cardForm);
    } else {
      this.form = {
        title: createDeckTitleField(""),
        description: new TextField(""),
        cards: [],
        speakingCardsLocale: new TextField<string | null>(null),
        speakingCardsField: new TextField<DeckSpeakFieldEnum | null>(null),
        folderId: screen.folder?.id ?? undefined,
        cardsToRemoveIds: [],
      };
    }
  }

  goToSpeakingCards() {
    if (!this.form || !isFormValid(this.form)) {
      return;
    }
    this.deckInnerScreen = "speakingCards";
  }

  goToCardList() {
    if (!this.form) {
      return;
    }
    if (!isFormValid(this.form)) {
      formTouchAll(this.form);
      return;
    }
    this.deckInnerScreen = "cardList";
  }

  quitInnerScreen() {
    this.deckInnerScreen = undefined;
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
    if (!this.form) {
      return;
    }
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
      formTouchAll(this.form);
      return;
    }

    this.cardFormIndex = this.form.cards.length;
    this.cardFormType = "new";
    this.form.cards.push({
      front: createCardSideField(""),
      back: createCardSideField(""),
      example: new TextField(""),
      answerType: createAnswerTypeField(),
      options: null,
      answers: createAnswerListField([], () => this.cardForm),
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

  onSaveCard() {
    const isEdit = this.cardForm?.id;
    this.onDeckSave(
      action(() => {
        if (isEdit) {
          return;
        }
        this.cardFormIndex = undefined;
        this.cardFormType = undefined;
      }),
    );
  }

  get isPreviousCardVisible() {
    if (this.filteredCards.length < 1) {
      return false;
    }
    const isCurrentFirst = this.filteredCards[0].id === this.cardForm?.id;
    return !isCurrentFirst;
  }

  get isNextCardVisible() {
    if (this.filteredCards.length < 1) {
      return false;
    }
    const isCurrentLast =
      this.filteredCards[this.filteredCards.length - 1].id ===
      this.cardForm?.id;
    return !isCurrentLast;
  }

  onPreviousCard() {
    if (!this.isPreviousCardVisible) {
      return;
    }
    this.onQuitCard(() => {
      const currentCardIndex = this.filteredCards.findIndex(
        (card) => card.id === this.cardForm?.id,
      );
      const nextCard = this.filteredCards[currentCardIndex - 1];
      this.editCardFormById(nextCard.id);
    });
  }

  onNextCard() {
    if (!this.isNextCardVisible) {
      return;
    }
    this.onQuitCard(() => {
      const currentCardIndex = this.filteredCards.findIndex(
        (card) => card.id === this.cardForm?.id,
      );
      const nextCard = this.filteredCards[currentCardIndex + 1];
      this.editCardFormById(nextCard.id);
    });
  }

  onBackCard() {
    this.onQuitCard(() => {
      this.quitCardForm();
    });
  }

  async onQuitCard(redirect: () => void) {
    assert(this.cardForm, "onCardBack: cardForm is empty");
    if (isFormEmpty(this.cardForm) || !isFormDirty(this.cardForm)) {
      redirect();
      return;
    }

    const confirmed = await showConfirm(t("deck_form_quit_card_confirm"));
    if (confirmed) {
      redirect();
    }
  }

  async onDeckBack(redirect: () => void) {
    assert(this.form, "onDeckBack: form is empty");
    if (isFormEmpty(this.form) || !isFormDirty(this.form)) {
      redirect();
      return;
    }

    const confirmed = await showConfirm(t("deck_form_quit_deck_confirm"));
    if (confirmed) {
      redirect();
    }
  }

  async markCardAsRemoved() {
    const result = await showConfirm(t("deck_form_remove_card_confirm"));
    if (!result) {
      return;
    }

    runInAction(() => {
      const selectedCard = this.cardForm;
      if (!selectedCard) {
        return;
      }
      assert(this.form, "markCardAsRemoved: form is empty");
      if (!selectedCard.id) {
        return;
      }

      this.form.cardsToRemoveIds.push(selectedCard.id);
      deckListStore.isAppLoading = true;
    });

    this.onDeckSave(
      action(() => {
        this.deckInnerScreen = "cardList";
        this.cardFormIndex = undefined;
        this.cardFormType = undefined;
      }),
    ).finally(
      action(() => {
        deckListStore.isAppLoading = false;
      }),
    );
  }

  async onDeckSave(onSuccess?: () => void) {
    assert(this.form, "onDeckSave: form is empty");

    if (!isFormValid(this.form)) {
      formTouchAll(this.form);
      return Promise.reject();
    }

    // TODO: figure out why this is needed, the isFormValid call above should've handled it
    if (this.cardForm && !isFormValid(this.cardForm)) {
      formTouchAll(this.cardForm);
      return Promise.reject();
    }

    // Avoid sending huge collections on every save
    // Only new and touched cards are sent to the server
    const newCards = this.form.cards.filter((card) => !card.id);
    const touchedCards = this.form.cards.filter(
      (card) => !!(card.id && (isFormTouched(card) || isFormDirty(card))),
    );
    const cardsToSend = newCards.concat(touchedCards).map(cardFormToApi);

    const result = await this.upsertDeckRequest.execute({
      id: this.form.id,
      title: this.form.title.value,
      description: this.form.description.value,
      cards: cardsToSend,
      speakLocale: this.form.speakingCardsLocale.value,
      speakField: this.form.speakingCardsField.value,
      folderId: this.form.folderId,
      cardsToRemoveIds: this.form.cardsToRemoveIds,
    });

    if (result.status === "error") {
      notifyError({ e: result.error, info: "Error saving deck" });
      return;
    }

    const { deck, folders, cardsToReview } = result.data;

    runInAction(() => {
      this.form = createUpdateForm(deck.id, deck, () => this.cardForm);
      deckListStore.replaceDeck(deck, true);
      deckListStore.updateFolders(folders);
      deckListStore.updateCardsToReview(cardsToReview);
      onSuccess?.();
    });
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
}
