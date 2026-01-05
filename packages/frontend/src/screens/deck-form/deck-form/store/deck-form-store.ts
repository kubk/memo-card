import {
  BooleanField,
  formTouchAll,
  isFormDirty,
  isFormEmpty,
  isFormValid,
  ListField,
  TextField,
  validators,
} from "mobx-form-lite";
import { makeAutoObservable, runInAction } from "mobx";
import { screenStore } from "../../../../store/screen-store.ts";
import { Route } from "../../../../store/routing/route-types.ts";
import { deckListStore } from "../../../../store/deck-list-store.ts";
import { showConfirm } from "../../../../lib/platform/show-confirm.ts";
import {
  DeckCardDbType,
  DeckCardOptionsDbType,
  DeckSpeakFieldEnum,
  DeckWithCardsDbType,
  SpeakLanguage,
  CardAnswerType,
} from "api";
import { v4 } from "uuid";
import { RequestStore } from "../../../../lib/mobx-request/request-store.ts";
import { notifyError } from "../../../shared/snackbar/snackbar.tsx";
import { assert } from "api";
import { t } from "../../../../translations/t.ts";
import { api } from "../../../../api/trpc-api.ts";
import { userStore } from "../../../../store/user-store.ts";
import { wysiwygStore } from "../../../../store/wysiwyg-store.ts";

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
  id?: number;
  options: TextField<DeckCardOptionsDbType>;
};

type DeckFormType = {
  id?: number;
  title: TextField<string>;
  description: TextField<string>;
  cards: CardFormType[];
  speakingCardsLocale: TextField<SpeakLanguage | null>;
  speakingCardsField: TextField<DeckSpeakFieldEnum | null>;
  speakAutoAi: BooleanField;
  reverseCards: BooleanField;
  folderId?: number;
  cardInputModeId: string | null;
};

const createDeckTitleField = (value: string) => {
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
  getForm?: () => CardFormType | null,
) => {
  return new TextField(value, {
    validate: getForm
      ? (value) => {
          const cardForm = getForm();
          if (cardForm?.answerType.value === "remember") {
            return validators.required(t("validation_required"))(value);
          }
          return undefined;
        }
      : undefined,
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
  getCardForm?: () => CardFormType | null,
) => {
  return new ListField<CardAnswerFormType>(answers, {
    validate: getCardForm
      ? (value) => {
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
        }
      : undefined,
  });
};

export const createAnswerTypeField = (card?: DeckCardDbType) => {
  return new TextField<CardAnswerType>(card ? card.answerType : "remember");
};

const createUpdateForm = (
  id: number,
  deck: DeckWithCardsDbType,
): DeckFormType => {
  return {
    id: id,
    title: createDeckTitleField(deck.name),
    description: new TextField(deck.description ?? ""),
    speakingCardsLocale: new TextField(deck.speakLocale),
    speakingCardsField: new TextField(deck.speakField),
    speakAutoAi: new BooleanField(deck.speakAutoAi),
    reverseCards: new BooleanField(deck.reverseCards),
    cardInputModeId: deck.cardInputModeId || null,
    cards: deck.deckCards.map((card) => ({
      id: card.id,
      front: createFrontCardField(card.front),
      back: createBackCardField(card.back),
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
      ),
    })),
  };
};

export type CardFilterSortBy = "createdAt" | "frontAlpha" | "backAlpha";
export type CardFilterDirection = "desc" | "asc";

export type VoiceType = "none" | "robotic" | "ai";

export class DeckFormStore {
  deckForm?: DeckFormType;
  deckCreateRequest = new RequestStore(api.deck.create.mutate);
  deckUpdateRequest = new RequestStore(api.deck.update.mutate);
  cardInputModeIdForForm: string | null = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  // Read filter values directly from the route (source of truth)
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

  get isSending() {
    return this.deckCreateRequest.isLoading || this.deckUpdateRequest.isLoading;
  }

  get deckFormScreen() {
    const screen = screenStore.screen;
    const cardId = screen.type === "deckForm" ? screen.cardId : undefined;
    if (cardId !== undefined) {
      return "cardForm";
    }
    return "deckForm";
  }

  loadForm() {
    const screen = screenStore.screen;
    const deckId = this.getDeckIdFromScreen(screen);

    if (deckId) {
      // Preserve existing form if same deck (for next/prev card navigation)
      if (!this.deckForm || this.deckForm.id !== deckId) {
        const deck = deckListStore.searchDeckById(deckId);
        assert(deck, "Deck not found in deckListStore");
        this.deckForm = createUpdateForm(deckId, deck);
      }
    } else {
      assert(screen.type === "deckForm", "Only deckForm can create new deck");
      this.deckForm = {
        title: createDeckTitleField(""),
        description: new TextField(""),
        cards: [],
        speakingCardsLocale: new TextField<SpeakLanguage | null>(null),
        speakingCardsField: new TextField<DeckSpeakFieldEnum | null>(null),
        speakAutoAi: new BooleanField(false),
        reverseCards: new BooleanField(false),
        folderId: screen.folder?.id ?? undefined,
        cardInputModeId: null,
      };
    }
  }

  private getDeckIdFromScreen(screen: Route): number | undefined {
    switch (screen.type) {
      case "deckForm":
        return screen.deckId;
      case "cardList":
      case "speakingCards":
      case "cardInputMode":
      case "cardInputModeForm":
        return screen.deckId;
      default:
        return undefined;
    }
  }

  goToSpeakingCards() {
    if (!this.deckForm?.id) return;
    if (!this.validateBeforeNavigate()) return;
    screenStore.go({ type: "speakingCards", deckId: this.deckForm.id });
  }

  goToCardList() {
    if (!this.deckForm?.id) return;
    if (!this.validateBeforeNavigate()) return;
    screenStore.go({
      type: "cardList",
      deckId: this.deckForm.id,
      ...this.getFilterParams(),
    });
  }

  goCardInputMode() {
    if (!this.deckForm?.id) return;
    if (!this.validateBeforeNavigate()) return;
    screenStore.go({ type: "cardInputMode", deckId: this.deckForm.id });
  }

  goCardInputModeForm(cardInputModeId?: string) {
    if (!this.deckForm?.id) return;
    if (!this.validateBeforeNavigate()) return;
    this.cardInputModeIdForForm = cardInputModeId || null;
    screenStore.go({
      type: "cardInputModeForm",
      deckId: this.deckForm.id,
      cardInputModeId,
    });
  }

  private validateBeforeNavigate(): boolean {
    if (!this.deckForm) return false;
    if (!isFormValid(this.deckForm)) {
      formTouchAll(this.deckForm);
      return false;
    }
    return true;
  }

  async quitSpeakingCardsScreen() {
    if (!this.deckForm) {
      return;
    }
    if (!isFormDirty(this.deckForm)) {
      screenStore.back();
      return;
    }
    const isConfirmed = await showConfirm(t("quit_without_saving"));
    if (isConfirmed) {
      screenStore.back();
    }
  }

  saveSpeakingCards() {
    this.onDeckSave(() => {
      screenStore.back();
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

          // Fallback to ID comparison
          return this.cardFilterSortDirection === "desc"
            ? b.id - a.id
            : a.id - b.id;
        }

        return this.cardFilterSortBy satisfies never;
      });
  }

  changeSort(sortBy: CardFilterSortBy) {
    const newDirection =
      this.cardFilterSortBy === sortBy
        ? this.isSortAsc
          ? "desc"
          : "asc"
        : this.cardFilterSortDirection;
    const newSortBy = sortBy;
    this.updateFiltersInUrl(newSortBy, newDirection, this.cardFilterText);
  }

  setSortByIdAndDirection(
    sortBy: CardFilterSortBy,
    direction: CardFilterDirection,
  ) {
    this.updateFiltersInUrl(sortBy, direction, this.cardFilterText);
  }

  updateSearchText(text: string) {
    this.updateFiltersInUrl(
      this.cardFilterSortBy,
      this.cardFilterSortDirection,
      text,
    );
  }

  private updateFiltersInUrl(
    sortBy: CardFilterSortBy,
    sortDirection: CardFilterDirection,
    searchText: string,
  ) {
    const screen = screenStore.screen;
    if (screen.type === "cardList" && this.deckForm?.id) {
      screenStore.replace({
        type: "cardList",
        deckId: this.deckForm.id,
        sortBy,
        sortDirection,
        searchText: searchText || undefined,
      });
    } else if (screen.type === "deckForm" && this.deckForm?.id) {
      screenStore.replaceToDeckForm({
        deckId: this.deckForm.id,
        cardId: screen.cardId,
        sortBy,
        sortDirection,
        searchText: searchText || undefined,
      });
    }
  }

  get isSortAsc() {
    return this.cardFilterSortDirection === "asc";
  }

  get currentSortId() {
    return `${this.cardFilterSortBy}-${this.cardFilterSortDirection}`;
  }

  get isEmptySearchResults() {
    return this.filteredCards.length === 0 && !!this.cardFilterText;
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
      speakingCardsLocale.onChange(SpeakLanguage.USEnglish);
      speakingCardsField.onChange("front");
    }
  }

  get isSpeakingCardEnabled() {
    return (
      !!this.deckForm?.speakingCardsLocale.value &&
      !!this.deckForm?.speakingCardsField.value
    );
  }

  get voiceType(): VoiceType {
    if (!this.deckForm) return "none";

    const { speakingCardsLocale, speakingCardsField, speakAutoAi } =
      this.deckForm;

    // If no locale or field, it's "none"
    if (!speakingCardsLocale.value || !speakingCardsField.value) {
      return "none";
    }

    // If AI is enabled, it's "ai"
    if (speakAutoAi.value) {
      return "ai";
    }

    // Otherwise it's "robotic"
    return "robotic";
  }

  setVoiceType(type: VoiceType) {
    if (!this.deckForm) return;

    const { speakingCardsLocale, speakingCardsField, speakAutoAi } =
      this.deckForm;

    if (type === "none") {
      speakingCardsLocale.onChange(null);
      speakingCardsField.onChange(null);
      speakAutoAi.setValue(false);
    } else if (type === "robotic") {
      // Set defaults if not already set
      if (!speakingCardsLocale.value) {
        speakingCardsLocale.onChange(SpeakLanguage.USEnglish);
      }
      if (!speakingCardsField.value) {
        speakingCardsField.onChange("front");
      }
      speakAutoAi.setValue(false);
    } else if (type === "ai") {
      // Set defaults if not already set
      if (!speakingCardsLocale.value) {
        speakingCardsLocale.onChange(SpeakLanguage.USEnglish);
      }
      if (!speakingCardsField.value) {
        speakingCardsField.onChange("front");
      }
      speakAutoAi.setValue(true);
    }
  }

  private getFilterParams() {
    return {
      sortBy: this.cardFilterSortBy,
      sortDirection: this.cardFilterSortDirection,
      searchText: this.cardFilterText || undefined,
    };
  }

  navigateToNewCard() {
    assert(this.deckForm, "navigateToNewCard: form is empty");
    assert(this.deckForm.id, "navigateToNewCard: deckId is empty");
    if (!isFormValid(this.deckForm)) {
      formTouchAll(this.deckForm);
      return;
    }

    screenStore.goToDeckForm({
      deckId: this.deckForm.id,
      cardId: "new",
    });
  }

  editCardFormById(cardId?: number, useReplace = false) {
    if (!cardId || !this.deckForm?.id) {
      return;
    }
    const params = {
      deckId: this.deckForm.id,
      cardId,
      ...this.getFilterParams(),
    };
    if (useReplace) {
      screenStore.replaceToDeckForm(params);
    } else {
      screenStore.goToDeckForm(params);
    }
  }

  async executeViaConfirm(redirect: () => void) {
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

  get isSaveVisible() {
    if (this.deckForm && !isFormDirty(this.deckForm)) {
      return false;
    }
    return (
      wysiwygStore.bottomSheet === null && userStore.selectedPaywall === null
    );
  }

  async onDeckSave(onSuccess?: (deck: DeckWithCardsDbType) => void) {
    assert(this.deckForm, "onDeckSave: form is empty");

    if (!isFormValid(this.deckForm)) {
      formTouchAll(this.deckForm);
      return Promise.reject();
    }

    // For new deck without id, create it first
    if (!this.deckForm.id) {
      const deckResult = await this.deckCreateRequest.execute({
        title: this.deckForm.title.value,
        description: this.deckForm.description.value || null,
        folderId: this.deckForm.folderId,
      });

      if (deckResult.status === "error") {
        notifyError({ e: deckResult.error, info: "Error creating deck" });
        return;
      }

      const { deck, folders, cardsToReview } = deckResult.data;

      runInAction(() => {
        this.deckForm = createUpdateForm(deck.id, deck);
        deckListStore.replaceDeck(deck, true);
        deckListStore.updateFolders(folders);
        deckListStore.updateCardsToReview(cardsToReview);
        onSuccess?.(deck);
      });

      return;
    }

    // Update existing deck metadata
    const result = await this.deckUpdateRequest.execute({
      id: this.deckForm.id,
      title: this.deckForm.title.value,
      description: this.deckForm.description.value,
      speakLocale: this.deckForm.speakingCardsLocale.value,
      speakField: this.deckForm.speakingCardsField.value,
      speakAutoAi: this.deckForm.speakAutoAi.value,
      reverseCards: this.deckForm.reverseCards.value,
      folderId: this.deckForm.folderId,
    });

    if (result.status === "error") {
      notifyError({ e: result.error, info: "Error saving deck" });
      return;
    }

    const { deck, folders, cardsToReview } = result.data;

    runInAction(() => {
      this.deckForm = createUpdateForm(deck.id, deck);
      deckListStore.replaceDeck(deck, true);
      deckListStore.updateFolders(folders);
      deckListStore.updateCardsToReview(cardsToReview);
      onSuccess?.(deck);
    });
  }
}
