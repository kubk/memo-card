import { RequestStore } from "../../../lib/mobx-request/request-store.ts";
import {
  cardInputModeListRequest,
  deckChangeInputModeRequest,
} from "../../../api/api.ts";
import { makeAutoObservable } from "mobx";
import { TextField } from "mobx-form-lite";
import { screenStore } from "../../../store/screen-store.ts";
import { assert } from "../../../lib/typescript/assert.ts";
import { notifyError, notifySuccess } from "../../shared/snackbar/snackbar.tsx";
import { deckListStore } from "../../../store/deck-list-store.ts";
import { t } from "../../../translations/t.ts";

export const createCachedCardInputModesRequest = () => {
  return new RequestStore(cardInputModeListRequest, {
    cacheId: "cardInputModeList",
  });
};

export class CardInputModeStore {
  cardInputModesRequest = createCachedCardInputModesRequest();
  deckChangeInputModeRequest = new RequestStore(deckChangeInputModeRequest);
  modeId = new TextField<string | null>(null);

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  load() {
    const { screen } = screenStore;
    assert(screen.type === "cardInputMode");

    this.modeId.onChange(screen.cardInputModeId);
    this.cardInputModesRequest.execute();
  }

  async submit() {
    if (this.cardInputModesRequest.isLoading) {
      return;
    }

    const { screen } = screenStore;
    assert(screen.type === "cardInputMode");

    const result = await this.deckChangeInputModeRequest.execute({
      deckId: screen.deckId,
      cardInputModeId: this.modeId.value,
    });

    if (result.status === "error") {
      notifyError({
        e: result.error,
        info: "Failed to change card input mode",
      });
      return;
    }

    deckListStore.updateDeckCardInputMode(screen.deckId, this.modeId.value);
    notifySuccess(t("card_input_mode_changed"));
    screenStore.go({
      type: "deckForm",
      deckId: screen.deckId,
    });
  }
}
