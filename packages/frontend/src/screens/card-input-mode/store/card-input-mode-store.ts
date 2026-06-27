import { makeAutoObservable } from "mobx";
import { TextField } from "mobx-form-lite";
import { notifyError, notifySuccess } from "../../shared/snackbar/snackbar.tsx";
import { deckListStore } from "../../../store/deck-list-store.ts";
import { t } from "../../../translations/t.ts";
import { DeckFormStore } from "../../deck-form/deck-form/store/deck-form-store.ts";
import { CardInputModeDb } from "api";
import { assert } from "api";
import { api } from "../../../api/trpc-api.ts";
import { screenStore } from "../../../store/screen-store.ts";
import { makeQuery } from "../../../lib/mobx-query-lite/make-query.ts";
import { makeMutation } from "../../../lib/mobx-query-lite/make-mutation.ts";

export class CardInputModeStore {
  cardInputModesQuery = makeQuery({
    key: "cardInputMode.list",
    query: api.cardInputMode.list.query,
  });
  deckChangeInputModeMutation = makeMutation(api.cardInputMode.change.mutate);
  modeId = new TextField<string | null>(null);
  viewModeId = new TextField<string | null>(null);

  constructor(private deckFormStore: DeckFormStore) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  load() {
    assert(this.deckFormStore.deckForm, "Deck form should be loaded");
    const cardInputModeId = this.deckFormStore.deckForm.cardInputModeId;

    this.modeId.onChange(cardInputModeId);
  }

  async submit() {
    if (this.deckChangeInputModeMutation.isPending) {
      return;
    }

    assert(this.deckFormStore.deckForm, "Deck form should be loaded");
    const deckId = this.deckFormStore.deckForm.id;
    assert(deckId, "Deck id should be defined");

    try {
      await this.deckChangeInputModeMutation.mutate({
        deckId: deckId,
        cardInputModeId: this.modeId.value,
      });
    } catch (error) {
      notifyError({
        e: error,
        info: "Failed to change card input mode",
      });
      return;
    }

    deckListStore.updateDeckCardInputMode(deckId, this.modeId.value);
    notifySuccess(t("card_input_mode_changed"));
    screenStore.back();
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

  get hasLoadedCardInputModes() {
    return this.cardInputModesQuery.data !== undefined;
  }

  get viewMode(): CardInputModeDb | null {
    return (
      this.cardInputModes.find(
        (inputMode) => inputMode.id === this.viewModeId.value,
      ) || null
    );
  }

  get isBottomSheetScreen() {
    return this.viewModeId.value !== null;
  }
}
