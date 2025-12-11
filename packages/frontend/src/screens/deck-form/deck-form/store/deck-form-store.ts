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
import { screenStore } from "../../../../store/screen-store.ts";
import { deckListStore } from "../../../../store/deck-list-store.ts";
import { showConfirm } from "../../../../lib/platform/show-confirm.ts";
import {
  DeckCardDbType,
  DeckCardOptionsDbType,
  DeckSpeakFieldEnum,
  DeckWithCardsDbType,
} from "api";
import { CardAnswerType } from "api";
import { v4 } from "uuid";
import {
  CardFormStoreInterface,
  CardInnerScreenType,
} from "./card-form-store-interface.ts";
import { UpsertDeckRequest } from "api";
import { UnwrapArray } from "../../../../lib/typescript/unwrap-array.ts";
import { RequestStore } from "../../../../lib/mobx-request/request-store.ts";
import { notifyError } from "../../../shared/snackbar/snackbar.tsx";
import { assert } from "api";
import { t } from "../../../../translations/t.ts";
import { SpeakLanguageEnum } from "../../../../lib/voice-playback/speak.ts";
import { api } from "../../../../api/trpc-api.ts";
import { MoveToDeckSelectorStore } from "./move-to-deck-selector-store";

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
  options: TextField<DeckCardOptionsDbType>;
};

type DeckFormType = {
  id?: number;
  title: TextField<string>;
  description: TextField<string>;
  cards: CardFormType[];
  speakingCardsLocale: TextField<string | null>;
  speakingCardsField: TextField<DeckSpeakFieldEnum | null>;
  reverseCards: BooleanField;
  folderId?: number;
  cardInputModeId: string | null;
  cardsToRemoveIds: number[];
};

export const createDeckTitleField = (value: string) => {
  return new TextField(value, {
    validate: validators.required(t("validation_deck_title")),
  });
};

export const createFrontCardField = (value: string) => {
  return new TextField(value, {
    validate: validators.required(t("validation_required")),
  });
};

export const createBackCardField = (
  value: string,
  getForm: () => CardFormType | null,
) => {
  return new TextField(value, {
    validate: (value) => {
      const cardForm = getForm();
      if (cardForm?.answerType.value === "remember") {
        return validators.required(t("validation_required"))(value);
      }
      return undefined;
    },
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
  return new TextField<CardAnswerType>(card ? card.answerType : "remember");
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
    speakingCardsLocale: new TextField(deck.speakLocale),
    speakingCardsField: new TextField(deck.speakField),
    reverseCards: new BooleanField(deck.reverseCards),
    cardInputModeId: deck.cardInputModeId || null,
    cards: deck.deckCards.map((card) => ({
      id: card.id,
      front: createFrontCardField(card.front),
      back: createBackCardField(card.back, getCardForm),
      example: new TextField(card.example || ""),
      answerType: createAnswerTypeField(card),
      options: new TextField<DeckCardOptionsDbType>(card.options ?? null),
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
    options: card.options.value,
    answers: card.answers.value.map((answer) => ({
      id: answer.id,
      text: answer.text.value,
      isCorrect: answer.isCorrect.value,
    })),
  };
};

export type CardFilterSortBy = "createdAt" | "frontAlpha" | "backAlpha";
export type CardFilterDirection = "desc" | "asc";

type DeckInnerScreen =
  | "cardList"
  | "speakingCards"
  | "cardInputMode"
  | "cardInputModeForm";

export type CardFilterForm = {
  text: TextField<string>;
  sortBy: TextField<CardFilterSortBy>;
  sortDirection: TextField<CardFilterDirection>;
};

export const createCardFilterForm = (): CardFilterForm => {
  return {
    text: new TextField(""),
    sortBy: new TextField<CardFilterSortBy>("createdAt"),
    sortDirection: new TextField<CardFilterDirection>("desc"),
  };
};

export class DeckFormStore implements CardFormStoreInterface {
  cardFormIndex?: number;
  cardFormType?: "new" | "edit";
  deckForm?: DeckFormType;
  upsertDeckRequest = new RequestStore(api.deckUpsert.mutate);
  cardInnerScreen = new TextField<CardInnerScreenType>(null);
  deckInnerScreen?: DeckInnerScreen;
  cardInputModeIdForForm: string | null = null;
  cardFilter = createCardFilterForm();
  moveToDeckStore = new MoveToDeckSelectorStore();

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
    const screen = screenStore.screen;
    assert(screen.type === "deckForm");

    if (screen.deckId) {
      const deck = deckListStore.searchDeckById(screen.deckId);
      assert(deck, "Deck not found in deckListStore");
      this.deckForm = createUpdateForm(
        screen.deckId,
        deck,
        () => this.cardForm,
      );
    } else {
      this.deckForm = {
        title: createDeckTitleField(""),
        description: new TextField(""),
        cards: [],
        speakingCardsLocale: new TextField<string | null>(null),
        speakingCardsField: new TextField<DeckSpeakFieldEnum | null>(null),
        reverseCards: new BooleanField(false),
        folderId: screen.folder?.id ?? undefined,
        cardsToRemoveIds: [],
        cardInputModeId: null,
      };
    }

    if (screen.cardId) {
      this.editCardFormById(screen.cardId);
    }
  }

  goToSpeakingCards() {
    this.goInnerScreen("speakingCards");
  }

  goToCardList() {
    this.goInnerScreen("cardList");
  }

  goCardInputMode() {
    this.goInnerScreen("cardInputMode");
  }

  goCardInputModeForm(cardInputModeId?: string) {
    this.cardInputModeIdForForm = cardInputModeId || null;
    this.goInnerScreen("cardInputModeForm");
  }

  private goInnerScreen(innerScreen: DeckInnerScreen) {
    if (!this.deckForm) {
      return;
    }
    if (!isFormValid(this.deckForm)) {
      formTouchAll(this.deckForm);
      return;
    }
    this.deckInnerScreen = innerScreen;
  }

  quitInnerScreen() {
    this.deckInnerScreen = undefined;
  }

  async quitSpeakingCardsScreen() {
    if (!this.deckForm) {
      return;
    }
    if (!isFormDirty(this.deckForm)) {
      this.quitInnerScreen();
      return;
    }
    const isConfirmed = await showConfirm(t("quit_without_saving"));
    if (isConfirmed) {
      this.quitInnerScreen();
    }
  }

  saveSpeakingCards() {
    this.onDeckSave(() => {
      this.quitInnerScreen();
    });
  }

  get filteredCards() {
    if (!this.deckForm) {
      return [];
    }

    // Build map of card ID to creation date
    const cardCreationDates = new Map<number, string>();
    if (this.deckForm.id) {
      const deck = deckListStore.searchDeckById(this.deckForm.id);
      if (deck) {
        deck.deckCards.forEach((card) => {
          cardCreationDates.set(card.id, card.createdAt);
        });
      }
    }

    return this.deckForm.cards
      .filter((card) => {
        if (this.cardFilter.text.value) {
          const textFilter = this.cardFilter.text.value.toLowerCase();
          return (
            card.front.value.toLowerCase().includes(textFilter) ||
            card.back.value.toLowerCase().includes(textFilter)
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
          if (!a.id && !b.id) return 0;
          if (!a.id)
            return this.cardFilter.sortDirection.value === "desc" ? 1 : -1;
          if (!b.id)
            return this.cardFilter.sortDirection.value === "desc" ? -1 : 1;

          const aDate = cardCreationDates.get(a.id);
          const bDate = cardCreationDates.get(b.id);

          if (aDate && bDate) {
            return this.cardFilter.sortDirection.value === "desc"
              ? bDate > aDate
                ? 1
                : bDate < aDate
                  ? -1
                  : 0
              : aDate > bDate
                ? 1
                : aDate < bDate
                  ? -1
                  : 0;
          }

          // Fallback to ID comparison
          return this.cardFilter.sortDirection.value === "desc"
            ? b.id - a.id
            : a.id - b.id;
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

  setSortByIdAndDirection(
    sortBy: CardFilterSortBy,
    direction: CardFilterDirection,
  ) {
    this.cardFilter.sortBy.onChange(sortBy);
    this.cardFilter.sortDirection.onChange(direction);
  }

  get isSortAsc() {
    return this.cardFilter.sortDirection.value === "asc";
  }

  get currentSortId() {
    return `${this.cardFilter.sortBy.value}-${this.cardFilter.sortDirection.value}`;
  }

  toggleIsSpeakingCardEnabled() {
    if (!this.deckForm) {
      return;
    }
    const { speakingCardsLocale, speakingCardsField } = this.deckForm;

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
      !!this.deckForm?.speakingCardsLocale.value &&
      !!this.deckForm?.speakingCardsField.value
    );
  }

  get cardForm() {
    return this.deckForm !== undefined && this.cardFormIndex !== undefined
      ? this.deckForm.cards[this.cardFormIndex]
      : null;
  }

  openNewCardForm() {
    assert(this.deckForm, "openNewCardForm: form is empty");
    if (!isFormValid(this.deckForm)) {
      formTouchAll(this.deckForm);
      return;
    }

    this.cardFormIndex = this.deckForm.cards.length;
    this.cardFormType = "new";
    this.deckForm.cards.push({
      front: createFrontCardField(""),
      back: createBackCardField("", () => {
        if (!this.deckForm || !this.cardFormIndex) return null;
        const cardForm = this.deckForm.cards[this.cardFormIndex];
        return cardForm || null;
      }),
      example: new TextField(""),
      answerType: createAnswerTypeField(),
      options: new TextField<DeckCardOptionsDbType>(null),
      answers: createAnswerListField([], () => this.cardForm),
    });
  }

  editCardFormByIndex(i: number) {
    this.cardFormIndex = i;
    this.cardFormType = "edit";
  }

  editCardFormById(cardId?: number) {
    if (!cardId || !this.deckForm) {
      return;
    }
    const cardIndex = this.deckForm.cards.findIndex(
      (card) => card.id === cardId,
    );
    if (cardIndex !== -1) {
      this.editCardFormByIndex(cardIndex);
    }
  }

  onSaveCard() {
    const isEditCard = this.cardForm?.id;
    const isNewDeck = !this.deckForm?.id;
    this.onDeckSave(
      action(() => {
        if (isEditCard) {
          return;
        }

        if (isNewDeck && this.deckForm?.id) {
          screenStore.restoreHistory();
          screenStore.goToDeckForm({ deckId: this.deckForm.id });
        }
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

  onOpenNewFromCard() {
    this.onQuitCard(() => {
      this.openNewCardForm();
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
    assert(this.deckForm, "onDeckBack: form is empty");
    if (isFormEmpty(this.deckForm) || !isFormDirty(this.deckForm)) {
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
      assert(this.deckForm, "markCardAsRemoved: form is empty");
      if (!selectedCard.id) {
        return;
      }

      this.deckForm.cardsToRemoveIds.push(selectedCard.id);
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

  async onDeckSave(onSuccess?: (deck: DeckWithCardsDbType) => void) {
    assert(this.deckForm, "onDeckSave: form is empty");

    if (!isFormValid(this.deckForm)) {
      formTouchAll(this.deckForm);
      return Promise.reject();
    }

    // TODO: figure out why this is needed, the isFormValid call above should've handled it
    if (this.cardForm && !isFormValid(this.cardForm)) {
      formTouchAll(this.cardForm);
      return Promise.reject();
    }

    // Avoid sending huge collections on every save
    // Only new and touched cards are sent to the server
    const newCards = this.deckForm.cards.filter((card) => !card.id);
    const touchedCards = this.deckForm.cards.filter(
      (card) => !!(card.id && (isFormTouched(card) || isFormDirty(card))),
    );
    const cardsToSend = newCards.concat(touchedCards).map(cardFormToApi);

    const result = await this.upsertDeckRequest.execute({
      id: this.deckForm.id,
      title: this.deckForm.title.value,
      description: this.deckForm.description.value,
      cards: cardsToSend,
      speakLocale: this.deckForm.speakingCardsLocale.value,
      speakField: this.deckForm.speakingCardsField.value,
      reverseCards: this.deckForm.reverseCards.value,
      folderId: this.deckForm.folderId,
      cardsToRemoveIds: this.deckForm.cardsToRemoveIds,
    });

    if (result.status === "error") {
      notifyError({ e: result.error, info: "Error saving deck" });
      return;
    }

    const { deck, folders, cardsToReview } = result.data;

    runInAction(() => {
      this.deckForm = createUpdateForm(deck.id, deck, () => this.cardForm);
      deckListStore.replaceDeck(deck, true);
      deckListStore.updateFolders(folders);
      deckListStore.updateCardsToReview(cardsToReview);
      onSuccess?.(deck);
    });
  }

  quitCardForm() {
    assert(
      this.cardFormIndex !== undefined,
      "quitCardForm: cardFormIndex is empty",
    );
    assert(this.deckForm, "quitCardForm: form is empty");
    if (this.cardFormType === "new") {
      this.deckForm.cards.splice(this.cardFormIndex, 1);
    }
    this.cardFormIndex = undefined;
    this.cardFormType = undefined;
  }

  openMoveCardSheet() {
    const cardId = this.cardForm?.id;
    const deckId = this.deckForm?.id;

    if (!cardId || !deckId) {
      return;
    }

    this.moveToDeckStore.open(deckId, [cardId], () => {
      this.quitCardForm();
      this.deckInnerScreen = undefined;
    });
  }
}
