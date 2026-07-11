import { createFrontCardField } from "../../deck-form/store/deck-form-store.ts";
import { makeMutation } from "../../../../lib/mobx-query-lite/make-mutation.ts";
import { makeAutoObservable } from "mobx";
import { formTouchAll, isFormValid } from "mobx-form-lite";
import { screenStore } from "../../../../store/screen-store.ts";
import { notifyError } from "../../../shared/snackbar/snackbar.tsx";
import { deckListStore } from "../../../../store/deck-list-store.ts";
import { voiceGenerationStore } from "../../../../store/voice-generation-store.ts";
import { assert } from "api";
import { api, apiProxy } from "../../../../api/trpc-api.ts";
import { notifyNewCards } from "../notify-new-cards.ts";
import { makeQuery } from "../../../../lib/mobx-query-lite/make-query.ts";

export class AiGeneratedCardFormStore {
  form = {
    prompt: createFrontCardField(""),
  };
  cardInputModesQuery = makeQuery(apiProxy.cardInputMode.list.query);
  aiSingleCardGenerateMutation = makeMutation(api.aiSingleCardGenerate.mutate);

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  async submit() {
    if (!isFormValid(this.form)) {
      formTouchAll(this.form);
      return;
    }

    const result = await this.aiSingleCardGenerateMutation.mutateResult({
      text: this.form.prompt.value,
      deckId: this.deckId,
    });

    if (!result.ok) {
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

    notifyNewCards(cards);

    const firstCard = cards[0];
    screenStore.replace({
      type: "deckForm",
      deckId: firstCard.deckId,
      cardId: firstCard.id,
    });

    voiceGenerationStore.generateForDeckCards(firstCard.deckId, cards);
  }

  get deckId() {
    const { screen } = screenStore;

    assert(screen.type === "deckForm", "Screen does not have deckId");
    assert(screen.deckId);

    return screen.deckId;
  }

  get isSaveLoading() {
    return (
      this.aiSingleCardGenerateMutation.isPending ||
      this.cardInputModesQuery.isFetching
    );
  }

  get cardInputModes() {
    return this.cardInputModesQuery.data ?? [];
  }

  get isLoadingCardInputModes() {
    return (
      this.cardInputModesQuery.data === undefined &&
      !this.cardInputModesQuery.error
    );
  }
}
