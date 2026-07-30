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
  DeckWithCardsDbType,
  RouterOutput,
  SpeakLanguage,
} from "api";
import { makeMutation } from "../../../../lib/mobx-query-lite/make-mutation.ts";
import { notifyError } from "../../../shared/snackbar/snackbar.tsx";
import { assert } from "api";
import { t } from "../../../../translations/t.ts";
import { api } from "../../../../api/trpc-api.ts";
import { userStore } from "../../../../store/user-store.ts";
import { wysiwygStore } from "../../../../store/wysiwyg-store.ts";
import { deckDetailsStore } from "../../../../store/deck-details-store.ts";

type DeckCardOptions = DeckCardDbType["options"];
type DeckSpeakField = NonNullable<DeckWithCardsDbType["speakField"]>;
type MyDeck = RouterOutput["me"]["info"]["myDecks"][number];

export type CardAnswerFormType = {
  id: string;
  text: TextField<string>;
  isCorrect: BooleanField;
};

export type CardFormType = {
  front: TextField<string>;
  back: TextField<string>;
  example: TextField<string>;
  answerType: TextField<DeckCardDbType["answerType"]>;
  answers: ListField<CardAnswerFormType>;
  id?: number;
  options: TextField<DeckCardOptions>;
};

type DeckFormType = {
  id?: number;
  title: TextField<string>;
  description: TextField<string>;
  cards: CardFormType[];
  speakingCardsLocale: TextField<SpeakLanguage | null>;
  speakingCardsField: TextField<DeckSpeakField | null>;
  reverseCards: BooleanField;
  folderId?: number;
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
    id: crypto.randomUUID(),
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
  return new TextField<DeckCardDbType["answerType"]>(
    card ? card.answerType : "remember",
  );
};

const createUpdateForm = (id: number, deck: MyDeck): DeckFormType => {
  return {
    id: id,
    title: createDeckTitleField(deck.name),
    description: new TextField(deck.description ?? ""),
    speakingCardsLocale: new TextField(deck.speakLocale),
    speakingCardsField: new TextField(deck.speakField),
    reverseCards: new BooleanField(deck.reverseCards),
    cards: deck.deckCards.map((card) => ({
      id: card.id,
      front: createFrontCardField(card.front),
      back: createBackCardField(card.back),
      example: new TextField(card.example || ""),
      answerType: createAnswerTypeField(card),
      options: new TextField<DeckCardOptions>(card.options ?? null),
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

export type VoiceType = "none" | "browser";

export class DeckFormStore {
  deckForm?: DeckFormType;
  deckCreateMutation = makeMutation(api.deck.create.mutate);
  deckUpdateMutation = makeMutation(api.deck.update.mutate);

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  // Read filter values directly from the route (source of truth)
  get cardFilterSortBy(): CardFilterSortBy {
    const screen = screenStore.screen;
    if (
      screen.type === "deckForm" ||
      screen.type === "cardList" ||
      screen.type === "cardListPreview"
    ) {
      return screen.sortBy ?? "createdAt";
    }
    return "createdAt";
  }

  get cardFilterSortDirection(): CardFilterDirection {
    const screen = screenStore.screen;
    if (
      screen.type === "deckForm" ||
      screen.type === "cardList" ||
      screen.type === "cardListPreview"
    ) {
      return screen.sortDirection ?? "desc";
    }
    return "desc";
  }

  get cardFilterText(): string {
    const screen = screenStore.screen;
    if (
      screen.type === "deckForm" ||
      screen.type === "cardList" ||
      screen.type === "cardListPreview"
    ) {
      return screen.searchText ?? "";
    }
    return "";
  }

  get isSending() {
    return (
      this.deckCreateMutation.isPending || this.deckUpdateMutation.isPending
    );
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
        speakingCardsField: new TextField<DeckSpeakField | null>(null),
        reverseCards: new BooleanField(false),
        folderId: screen.folderId,
      };
    }
  }

  private getDeckIdFromScreen(screen: Route): number | undefined {
    switch (screen.type) {
      case "deckForm":
        return screen.deckId;
      case "speakingCards":
        return screen.deckId;
      default:
        return undefined;
    }
  }

  goToSpeakingCards() {
    if (!this.deckForm?.id) return;
    if (!this.validateBeforeNavigate()) return;
    screenStore.push({ type: "speakingCards", deckId: this.deckForm.id });
  }

  goToCardList() {
    if (!this.deckForm?.id) return;
    if (!this.validateBeforeNavigate()) return;
    const deck = deckListStore.searchDeckById(this.deckForm.id);
    if (deck) {
      deckDetailsStore.setDeck(deck);
    }
    screenStore.push({
      type: "cardList",
      deckId: this.deckForm.id,
      ...this.getFilterParams(),
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

  get voiceType(): VoiceType {
    if (!this.deckForm) return "none";

    const { speakingCardsLocale, speakingCardsField } = this.deckForm;

    if (!speakingCardsLocale.value || !speakingCardsField.value) {
      return "none";
    }

    return "browser";
  }

  setVoiceType(type: VoiceType) {
    if (!this.deckForm) return;

    const { speakingCardsLocale, speakingCardsField } = this.deckForm;

    if (type === "none") {
      speakingCardsLocale.onChange(null);
      speakingCardsField.onChange(null);
    } else if (type === "browser") {
      if (!speakingCardsLocale.value) {
        speakingCardsLocale.onChange(SpeakLanguage.USEnglish);
      }
      if (!speakingCardsField.value) {
        speakingCardsField.onChange("front");
      }
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

    screenStore.push({
      type: "deckForm",
      deckId: this.deckForm.id,
      cardId: "new",
    });
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
    if (!this.deckForm) {
      return false;
    }
    if (this.deckForm.id && !isFormDirty(this.deckForm)) {
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
      return;
    }

    // For new deck without id, create it first
    if (!this.deckForm.id) {
      const deckResult = await this.deckCreateMutation.mutateResult({
        title: this.deckForm.title.value,
        description: this.deckForm.description.value || null,
        folderId: this.deckForm.folderId,
      });

      if (!deckResult.ok) {
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
    const result = await this.deckUpdateMutation.mutateResult({
      id: this.deckForm.id,
      title: this.deckForm.title.value,
      description: this.deckForm.description.value,
      speakLocale: this.deckForm.speakingCardsLocale.value,
      speakField: this.deckForm.speakingCardsField.value,
      reverseCards: this.deckForm.reverseCards.value,
      folderId: this.deckForm.folderId,
    });

    if (!result.ok) {
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
