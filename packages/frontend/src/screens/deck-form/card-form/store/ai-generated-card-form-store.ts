import { createFrontCardField } from "../../deck-form/store/deck-form-store.ts";
import { RequestStore } from "../../../../lib/mobx-request/request-store.ts";
import { makeAutoObservable } from "mobx";
import { formTouchAll, isFormValid } from "mobx-form-lite";
import { screenStore } from "../../../../store/screen-store.ts";
import {
  notifyError,
  notifySuccess,
} from "../../../shared/snackbar/snackbar.tsx";
import { deckListStore } from "../../../../store/deck-list-store.ts";
import { createCachedCardInputModesRequest } from "../../../../api/create-cached-card-input-modes-request.ts";
import { assert } from "api";
import { api } from "../../../../api/trpc-api.ts";
import { generateVoiceForNewCards } from "../../../../lib/voice/generate-voice-for-new-cards.ts";
import { t } from "../../../../translations/t.ts";

export class AiGeneratedCardFormStore {
  form = {
    prompt: createFrontCardField(""),
  };
  cardInputModesRequest = createCachedCardInputModesRequest();
  aiSingleCardGenerateRequest = new RequestStore(
    api.aiSingleCardGenerate.mutate,
  );

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  async submit() {
    if (!isFormValid(this.form)) {
      formTouchAll(this.form);
      return;
    }

    const result = await this.aiSingleCardGenerateRequest.execute({
      text: this.form.prompt.value,
      deckId: this.deckId,
    });

    if (result.status === "error") {
      notifyError({
        e: result.error,
        info: "Error while generating single card",
      });
      return;
    }

    if (!result.data.data) {
      notifyError(false, { message: result.data.error });
      return;
    }

    const { cards } = result.data.data;
    cards.forEach((card) => {
      deckListStore.addCardOptimistic(card);
    });

    if (cards.length === 2) {
      notifySuccess(t("two_cards_created"));
    }

    const firstCard = cards[0];
    screenStore.replaceToDeckForm({
      deckId: firstCard.deckId,
      cardId: firstCard.id,
    });

    // Generate AI voice for the new cards if enabled on deck
    generateVoiceForNewCards({
      deckId: firstCard.deckId,
      cards,
    });
  }

  get deckId() {
    const { screen } = screenStore;

    assert(screen.type === "deckForm", "Screen does not have deckId");
    assert(screen.deckId);

    return screen.deckId;
  }

  get isSaveLoading() {
    return (
      this.aiSingleCardGenerateRequest.isLoading ||
      this.cardInputModesRequest.isLoading
    );
  }
}
