import { RequestStore } from "../../../lib/mobx-request/request-store.ts";
import { deckChangeInputModeRequest } from "../../../api/api.ts";
import { makeAutoObservable } from "mobx";
import { TextField } from "mobx-form-lite";
import { assert } from "../../../lib/typescript/assert.ts";
import { notifyError, notifySuccess } from "../../shared/snackbar/snackbar.tsx";
import { deckListStore } from "../../../store/deck-list-store.ts";
import { t } from "../../../translations/t.ts";
import { DeckFormStore } from "../../deck-form/deck-form/store/deck-form-store.ts";
import { createCachedCardInputModesRequest } from "../../../api/create-cached-card-input-modes-request.ts";
import { CardInputModeDb } from "../../../../functions/db/card-input-mode/schema.ts";
import { screenStore } from "../../../store/screen-store.ts";

export class CardInputModeStore {
  cardInputModesRequest = createCachedCardInputModesRequest();
  deckChangeInputModeRequest = new RequestStore(deckChangeInputModeRequest);
  modeId = new TextField<string | null>(null);
  viewModeId = new TextField<string | null>(null);

  constructor(private deckFormStore: DeckFormStore) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  load() {
    assert(this.deckFormStore.deckForm, "Deck form should be loaded");
    const cardInputModeId = this.deckFormStore.deckForm.cardInputModeId;

    this.modeId.onChange(cardInputModeId);
    this.cardInputModesRequest.execute();
  }

  async submit() {
    if (this.cardInputModesRequest.isLoading) {
      return;
    }

    assert(this.deckFormStore.deckForm, "Deck form should be loaded");
    const deckId = this.deckFormStore.deckForm.id;
    assert(deckId, "Deck id should be defined");

    const result = await this.deckChangeInputModeRequest.execute({
      deckId: deckId,
      cardInputModeId: this.modeId.value,
    });

    if (result.status === "error") {
      notifyError({
        e: result.error,
        info: "Failed to change card input mode",
      });
      return;
    }

    deckListStore.updateDeckCardInputMode(deckId, this.modeId.value);
    notifySuccess(t("card_input_mode_changed"));
    this.deckFormStore.quitInnerScreen();

    screenStore.restoreHistory();
    screenStore.go({ type: 'deckForm', deckId });
  }

  get viewMode(): CardInputModeDb | null {
    if (this.cardInputModesRequest.result.status !== "success") {
      return null;
    }
    return (
      this.cardInputModesRequest.result.data.find(
        (inputMode) => inputMode.id === this.viewModeId.value,
      ) || null
    );
  }

  get isBottomSheetScreen() {
    return this.viewModeId.value !== null;
  }
}
