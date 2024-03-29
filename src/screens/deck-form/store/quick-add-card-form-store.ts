import {
  CardFormType,
  createAnswerListField,
  createAnswerTypeField,
  createCardSideField,
} from "./deck-form-store.ts";
import { action, makeAutoObservable } from "mobx";
import {
  BooleanToggle,
  formTouchAll,
  isFormDirty,
  isFormEmpty,
  isFormValid,
  TextField,
} from "mobx-form-lite";
import { screenStore } from "../../../store/screen-store.ts";
import { showConfirm } from "../../../lib/telegram/show-confirm.ts";
import { addCardRequest } from "../../../api/api.ts";
import { assert } from "../../../lib/typescript/assert.ts";
import { AddCardRequest } from "../../../../functions/add-card.ts";
import { deckListStore } from "../../../store/deck-list-store.ts";
import { t } from "../../../translations/t.ts";
import { CardFormStoreInterface } from "./card-form-store-interface.ts";
import { DeckSpeakFieldEnum } from "../../../../functions/db/deck/decks-with-cards-schema.ts";

export class QuickAddCardFormStore implements CardFormStoreInterface {
  cardForm: CardFormType = {
    back: createCardSideField(""),
    front: createCardSideField(""),
    example: new TextField(""),
    answerType: createAnswerTypeField(),
    options: null,
    answers: createAnswerListField([], () => this.cardForm),
  };
  isSending = false;
  isCardPreviewSelected = new BooleanToggle(false);
  isSaveCardButtonActive = true;

  constructor(
    public form?: {
      speakingCardsLocale: TextField<string | null>;
      speakingCardsField: TextField<DeckSpeakFieldEnum | null>;
    },
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  onSaveCard() {
    if (!isFormValid(this.cardForm)) {
      formTouchAll(this.cardForm);
      return;
    }

    const screen = screenStore.screen;
    assert(screen.type === "cardQuickAddForm");

    this.isSending = true;

    const body: AddCardRequest = {
      deckId: screen.deckId,
      card: {
        back: this.cardForm.back.value,
        front: this.cardForm.front.value,
        example: this.cardForm.example.value,
        answerType: this.cardForm.answerType.value,
        answers: this.cardForm.answers.value.map((answer) => ({
          id: answer.id,
          text: answer.text.value,
          isCorrect: answer.isCorrect.value,
        })),
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

  async onBackCard() {
    if (isFormEmpty(this.cardForm) || !isFormDirty(this.cardForm)) {
      screenStore.back();
      return;
    }

    const confirmed = await showConfirm(t("deck_form_quit_card_confirm"));
    if (confirmed) {
      screenStore.back();
    }
  }
}
