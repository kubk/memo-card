import {
  BooleanField,
  BooleanToggle,
  formTouchAll,
  formUnTouchAll,
  isFormDirty,
  isFormEmpty,
  isFormValid,
  TextField,
} from "mobx-form-lite";
import { makeAutoObservable, reaction, runInAction } from "mobx";
import { screenStore } from "../../../../store/screen-store.ts";
import { deckListStore } from "../../../../store/deck-list-store.ts";
import { appLoaderStore } from "../../../../store/app-loader-store.ts";
import { showConfirm } from "../../../../lib/platform/show-confirm.ts";
import {
  DeckCardDbType,
  DeckCardOptionsDbType,
  SpeakLanguage,
  DeckSpeakFieldEnum,
} from "api";
import { CardInnerScreenType } from "./card-preview-types.ts";
import { RequestStore } from "../../../../lib/mobx-request/request-store.ts";
import { notifyError } from "../../../shared/snackbar/snackbar.tsx";
import { assert } from "api";
import { t } from "../../../../translations/t.ts";
import { api } from "../../../../api/trpc-api.ts";
import { MoveToDeckSelectorStore } from "../../deck-form/store/move-to-deck-selector-store.tsx";
import { voiceGenerationStore } from "../../../../store/voice-generation-store.ts";
import {
  CardFormType,
  CardFilterSortBy,
  CardFilterDirection,
  createFrontCardField,
  createBackCardField,
  createAnswerTypeField,
  createAnswerListField,
} from "../../deck-form/store/deck-form-store.ts";
import { notifyNewCards } from "../notify-new-cards.ts";
import { userStore } from "../../../../store/user-store.ts";
import { wysiwygStore } from "../../../../store/wysiwyg-store.ts";

export class CardFormStore {
  cardForm: CardFormType | null = null;
  cardAddRequest = new RequestStore(api.card.add.mutate);
  cardUpdateRequest = new RequestStore(api.card.update.mutate);
  cardDeleteRequest = new RequestStore(api.card.delete.mutate);
  cardInnerScreen = new TextField<CardInnerScreenType>(null);
  moveToDeckStore = new MoveToDeckSelectorStore();
  cardTypeModal = new BooleanToggle(false);

  constructor() {
    makeAutoObservable(
      this,
      {
        onQuitCard: false,
      },
      { autoBind: true },
    );

    reaction(
      () => this.cardId,
      () => this.loadForm(),
    );
  }

  get deckId(): number | undefined {
    const screen = screenStore.screen;
    return screen.type === "deckForm" ? screen.deckId : undefined;
  }

  get cardId(): number | "new" | undefined {
    const screen = screenStore.screen;
    return screen.type === "deckForm" ? screen.cardId : undefined;
  }

  get cardFormType(): "new" | "edit" | undefined {
    if (this.cardId === undefined) {
      return undefined;
    }
    return this.cardId === "new" ? "new" : "edit";
  }

  get isSending() {
    return (
      this.cardAddRequest.isLoading ||
      this.cardUpdateRequest.isLoading ||
      this.cardDeleteRequest.isLoading
    );
  }

  private get deck() {
    if (!this.deckId) return undefined;
    return deckListStore.searchDeckById(this.deckId);
  }

  get speakingCardsLocale(): SpeakLanguage | null {
    return this.deck?.speakLocale ?? null;
  }

  get speakingCardsField(): DeckSpeakFieldEnum | null {
    return this.deck?.speakField ?? null;
  }

  get cardInputModeId(): string | null {
    return this.deck?.cardInputModeId ?? null;
  }

  private get deckCards(): CardFormType[] {
    const deck = this.deck;
    if (!deck) return [];
    return deck.deckCards.map((card) => ({
      id: card.id,
      front: createFrontCardField(card.front),
      back: createBackCardField(card.back, () => this.cardForm),
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
        () => this.cardForm,
      ),
    }));
  }

  get cardFilterSortBy(): CardFilterSortBy {
    const screen = screenStore.screen;
    if (screen.type === "deckForm" || screen.type === "cardList") {
      return screen.sortBy ?? "createdAt";
    }
    return "createdAt";
  }

  get cardFilterSortDirection(): CardFilterDirection {
    const screen = screenStore.screen;
    if (screen.type === "deckForm" || screen.type === "cardList") {
      return screen.sortDirection ?? "desc";
    }
    return "desc";
  }

  get cardFilterText(): string {
    const screen = screenStore.screen;
    if (screen.type === "deckForm" || screen.type === "cardList") {
      return screen.searchText ?? "";
    }
    return "";
  }

  get filteredCards() {
    const deck = this.deck;
    if (!deck) return [];

    const cardCreationDates = new Map<number, string>();
    deck.deckCards.forEach((card) => {
      cardCreationDates.set(card.id, card.createdAt);
    });

    return this.deckCards
      .filter((card) => {
        if (this.cardFilterText) {
          const textFilter = this.cardFilterText.toLowerCase();
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

        if (this.cardFilterSortBy === "frontAlpha") {
          return this.cardFilterSortDirection === "desc"
            ? bFront.localeCompare(aFront)
            : aFront.localeCompare(bFront);
        }
        if (this.cardFilterSortBy === "backAlpha") {
          return this.cardFilterSortDirection === "desc"
            ? bBack.localeCompare(aBack)
            : aBack.localeCompare(bBack);
        }
        if (this.cardFilterSortBy === "createdAt") {
          if (!a.id && !b.id) return 0;
          if (!a.id) return this.cardFilterSortDirection === "desc" ? 1 : -1;
          if (!b.id) return this.cardFilterSortDirection === "desc" ? -1 : 1;

          const aDate = cardCreationDates.get(a.id);
          const bDate = cardCreationDates.get(b.id);

          if (aDate && bDate) {
            return this.cardFilterSortDirection === "desc"
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

          return this.cardFilterSortDirection === "desc"
            ? b.id - a.id
            : a.id - b.id;
        }

        return this.cardFilterSortBy satisfies never;
      });
  }

  loadForm() {
    if (this.cardId === "new") {
      this.cardForm = this.createEmptyCardForm();
      return;
    }
    if (!this.cardId) return;

    const existingCard = this.deckCards.find((c) => c.id === this.cardId);
    if (!existingCard) return;

    this.cardForm = this.createCardFormFromData(existingCard);
  }

  private createEmptyCardForm(): CardFormType {
    return {
      front: createFrontCardField(""),
      back: createBackCardField("", () => this.cardForm),
      example: new TextField(""),
      answerType: createAnswerTypeField(),
      options: new TextField<DeckCardOptionsDbType>(null),
      answers: createAnswerListField([], () => this.cardForm),
    };
  }

  private createCardFormFromData(card: CardFormType): CardFormType {
    return {
      id: card.id,
      front: createFrontCardField(card.front.value),
      back: createBackCardField(card.back.value, () => this.cardForm),
      example: new TextField(card.example.value),
      answerType: createAnswerTypeField({
        answerType: card.answerType.value,
      } as DeckCardDbType),
      options: new TextField<DeckCardOptionsDbType>(card.options.value),
      answers: createAnswerListField(
        card.answers.value.map((answer) => ({
          id: answer.id,
          text: new TextField(answer.text.value),
          isCorrect: new BooleanField(answer.isCorrect.value),
        })),
        () => this.cardForm,
      ),
    };
  }

  private getFilterParams() {
    return {
      sortBy: this.cardFilterSortBy,
      sortDirection: this.cardFilterSortDirection,
      searchText: this.cardFilterText || undefined,
    };
  }

  navigateToNewCard() {
    assert(this.deckId, "navigateToNewCard: deckId is empty");
    screenStore.goToDeckForm({
      deckId: this.deckId,
      cardId: "new",
    });
  }

  editCardFormById(cardId?: number, useReplace = false) {
    if (!cardId || !this.deckId) {
      return;
    }
    const params = {
      deckId: this.deckId,
      cardId,
      ...this.getFilterParams(),
    };
    if (useReplace) {
      screenStore.replaceToDeckForm(params);
    } else {
      screenStore.goToDeckForm(params);
    }
  }

  async onSaveCard() {
    const isNewCard = this.cardFormType === "new";
    if (isNewCard) {
      await this.createCard();
    } else {
      await this.updateCard();
    }
  }

  private async createCard() {
    assert(this.deckId, "createCard: deckId is empty");
    assert(this.cardForm, "createCard: cardForm is empty");

    if (!isFormValid(this.cardForm)) {
      formTouchAll(this.cardForm);
      return;
    }

    const result = await this.cardAddRequest.execute({
      deckId: this.deckId,
      card: {
        front: this.cardForm.front.value,
        back: this.cardForm.back.value,
        example: this.cardForm.example.value || null,
        answerType: this.cardForm.answerType.value,
        answers: this.cardForm.answers.value.map((a) => ({
          id: a.id,
          text: a.text.value,
          isCorrect: a.isCorrect.value,
        })),
      },
    });

    if (result.status === "error") {
      notifyError({ e: result.error, info: "Error creating card" });
      return;
    }

    const { createdCards, deck, cardsToReview } = result.data;

    runInAction(() => {
      deckListStore.replaceDeck(deck, true);
      deckListStore.updateCardsToReview(cardsToReview);
      this.editCardFormById(result.data.createdCards[0].id, true);
      if (this.cardForm) {
        formUnTouchAll(this.cardForm);
      }
      notifyNewCards(result.data.createdCards);
    });

    voiceGenerationStore.generateForCard(deck, createdCards[0]);
  }

  private async updateCard() {
    assert(this.cardForm, "updateCard: cardForm is empty");
    assert(this.cardForm.id, "updateCard: cardId is empty");

    if (!isFormValid(this.cardForm)) {
      formTouchAll(this.cardForm);
      return;
    }

    const result = await this.cardUpdateRequest.execute({
      id: this.cardForm.id,
      front: this.cardForm.front.value,
      back: this.cardForm.back.value,
      example: this.cardForm.example.value || null,
      answerType: this.cardForm.answerType.value,
      answers: this.cardForm.answers.value.map((a) => ({
        id: a.id,
        text: a.text.value,
        isCorrect: a.isCorrect.value,
      })),
      options: this.cardForm.options.value,
    });

    if (result.status === "error") {
      notifyError({ e: result.error, info: "Error updating card" });
      return;
    }

    const { deck, cardsToReview } = result.data;

    runInAction(() => {
      deckListStore.replaceDeck(deck, true);
      deckListStore.updateCardsToReview(cardsToReview);
      if (this.cardForm) {
        formUnTouchAll(this.cardForm);
      }
    });
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

  get isCardNavigationVisible() {
    return (
      !!this.cardForm?.id &&
      (this.isPreviousCardVisible || this.isNextCardVisible)
    );
  }

  get isCardPreviewVisible() {
    return !!this.cardForm && isFormValid(this.cardForm);
  }

  get isMoveCardVisible() {
    return (
      !!this.cardForm?.id &&
      this.moveToDeckStore.availableDecksGrouped.length > 1
    );
  }

  onPreviousCard() {
    if (!this.isPreviousCardVisible) {
      return;
    }
    this.onQuitCard(() => {
      const currentCardIndex = this.filteredCards.findIndex(
        (card) => card.id === this.cardForm?.id,
      );
      const prevCard = this.filteredCards[currentCardIndex - 1];
      this.editCardFormById(prevCard.id, true);
    });
  }

  onOpenNewFromCard() {
    this.onQuitCard(() => {
      this.navigateToNewCard();
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
      this.editCardFormById(nextCard.id, true);
    });
  }

  onBackCard() {
    this.onQuitCard(() => {
      screenStore.back();
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

  async markCardAsRemoved() {
    const confirmed = await showConfirm(t("deck_form_remove_card_confirm"));
    if (!confirmed) {
      return;
    }

    const selectedCard = this.cardForm;
    if (!selectedCard?.id) {
      return;
    }

    appLoaderStore.enable();

    try {
      const result = await this.cardDeleteRequest.execute({
        id: selectedCard.id,
      });

      if (result.status === "error") {
        notifyError({ e: result.error, info: "Error deleting card" });
        return;
      }

      const { deck, cardsToReview } = result.data;

      runInAction(() => {
        deckListStore.replaceDeck(deck, true);
        deckListStore.updateCardsToReview(cardsToReview);
        screenStore.back();
      });
    } finally {
      appLoaderStore.disable();
    }
  }

  openMoveCardSheet() {
    const cardId = this.cardForm?.id;
    const deckId = this.deckId;

    if (!cardId || !deckId) {
      return;
    }

    this.moveToDeckStore.open(deckId, [cardId], () => {
      // this.quitCardForm();
      screenStore.back();
    });
  }

  get isSaveVisible() {
    if (!this.cardForm) return;
    if (!isFormDirty(this.cardForm)) {
      return false;
    }
    if (this.moveToDeckStore.isOpen) {
      return false;
    }
    return (
      wysiwygStore.bottomSheet === null && userStore.selectedPaywall === null
    );
  }
}
