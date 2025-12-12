import {
  CardFormType,
  createAnswerListField,
  createAnswerTypeField,
  createBackCardField,
  createFrontCardField,
} from "../../deck-form/store/deck-form-store.ts";
import { makeAutoObservable } from "mobx";
import {
  formToPlain,
  formTouchAll,
  isFormDirty,
  isFormEmpty,
  isFormValid,
  TextField,
} from "mobx-form-lite";
import { screenStore } from "../../../../store/screen-store.ts";
import { showConfirm } from "../../../../lib/platform/show-confirm.ts";
import { AddCardRequest } from "api";
import { deckListStore } from "../../../../store/deck-list-store.ts";
import { t } from "../../../../translations/t.ts";
import {
  CardFormStoreInterface,
  CardInnerScreenType,
  LimitedDeckForm,
} from "../../deck-form/store/card-form-store-interface.ts";
import { DeckCardOptionsDbType } from "api";
import { RequestStore } from "../../../../lib/mobx-request/request-store.ts";
import {
  notifyError,
  notifySuccess,
} from "../../../shared/snackbar/snackbar.tsx";
import { assert } from "api";
import { api } from "../../../../api/trpc-api.ts";

export class QuickAddCardFormStore implements CardFormStoreInterface {
  cardForm: CardFormType = {
    back: createBackCardField("", () => this.cardForm),
    front: createFrontCardField(""),
    example: new TextField(""),
    answerType: createAnswerTypeField(),
    options: new TextField<DeckCardOptionsDbType>(null),
    answers: createAnswerListField([], () => this.cardForm),
  };
  addCardRequest = new RequestStore(api.card.add.mutate);
  cardInnerScreen = new TextField<CardInnerScreenType>(null);

  constructor(public deckForm?: LimitedDeckForm) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get isSending() {
    return this.addCardRequest.isLoading;
  }

  async onSaveCard() {
    if (!isFormValid(this.cardForm)) {
      formTouchAll(this.cardForm);
      return;
    }

    const screen = screenStore.screen;
    assert(screen.type === "cardQuickAddForm");

    const body: AddCardRequest = {
      deckId: screen.deckId,
      card: formToPlain(this.cardForm),
    };

    const result = await this.addCardRequest.execute(body);
    if (result.status === "error") {
      notifyError({
        e: result.error,
        info: JSON.stringify({
          body,
          title: "Error adding quick card",
        }),
      });
      return;
    }

    screenStore.back();
    deckListStore.addCardOptimistic(result.data.card);
    notifySuccess(t("card_added"), {
      anchorOrigin: { vertical: "top", horizontal: "center" },
    });
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
