import { RequestStore } from "../../../lib/mobx-request/request-store.ts";
import { makeAutoObservable } from "mobx";
import { formToPlain, TextField, validators } from "mobx-form-lite";
import { notifyError, notifySuccess } from "../../shared/snackbar/snackbar.tsx";
import { DeckFormStore } from "../../deck-form/deck-form/store/deck-form-store.ts";
import { createCachedCardInputModesRequest } from "../../../api/create-cached-card-input-modes-request.ts";
import { CardInputModeDb } from "api";
import { api } from "../../../api/trpc-api.ts";
import { t } from "../../../translations/t.ts";
import { showConfirm } from "../../../lib/platform/show-confirm.ts";

export class CardInputModeFormStore {
  cardInputModesRequest = createCachedCardInputModesRequest();
  createRequest = new RequestStore(api.cardInputMode.create.mutate);
  updateRequest = new RequestStore(api.cardInputMode.update.mutate);
  deleteRequest = new RequestStore(api.cardInputMode.delete.mutate);

  form = {
    title: new TextField("", {
      validate: validators.required(t("validation_required")),
    }),
    prompt: new TextField("", {
      validate: validators.required(t("validation_required")),
    }),
    front: new TextField("", {
      validate: validators.required(t("validation_required")),
    }),
    back: new TextField("", {
      validate: validators.required(t("validation_required")),
    }),
    example: new TextField(""),
  };

  constructor(private deckFormStore: DeckFormStore) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get isEditing() {
    return !!this.deckFormStore.cardInputModeIdForForm;
  }

  get cardInputMode(): CardInputModeDb | null {
    if (!this.deckFormStore.cardInputModeIdForForm) return null;
    if (this.cardInputModesRequest.result.status !== "success") return null;

    return (
      this.cardInputModesRequest.result.data.find(
        (mode) => mode.id === this.deckFormStore.cardInputModeIdForForm,
      ) || null
    );
  }

  async load() {
    await this.cardInputModesRequest.execute();

    if (this.isEditing && this.cardInputMode) {
      const mode = this.cardInputMode;
      this.form.title.onChange(mode.title);
      this.form.prompt.onChange(mode.prompt);
      this.form.front.onChange(mode.front);
      this.form.back.onChange(mode.back);
      this.form.example.onChange(mode.example);
    }
  }

  async submit() {
    if (this.isAnyRequestLoading) return;

    const data = formToPlain(this.form);

    const result = this.deckFormStore.cardInputModeIdForForm
      ? await this.updateRequest.execute({
          id: this.deckFormStore.cardInputModeIdForForm,
          ...data,
        })
      : await this.createRequest.execute(data);

    if (result.status === "error") {
      notifyError(result.error);
      return;
    }

    this.cardInputModesRequest.invalidate();

    notifySuccess(t("card_input_mode_form_save_success"));
    this.deckFormStore.quitInnerScreen();
  }

  async handleDelete() {
    const confirmed = await showConfirm(
      t("card_input_mode_form_delete_confirm"),
    );

    if (confirmed) {
      await this.delete();
    }
  }

  async delete() {
    if (!this.isEditing || this.isAnyRequestLoading) return;

    const result = await this.deleteRequest.execute({
      id: this.deckFormStore.cardInputModeIdForForm!,
    });

    if (result.status === "error") {
      notifyError(result.error);
      return;
    }

    this.cardInputModesRequest.invalidate();

    notifySuccess(t("card_input_mode_form_delete_success"));
    this.deckFormStore.quitInnerScreen();
  }

  get isAnyRequestLoading() {
    return (
      this.createRequest.isLoading ||
      this.updateRequest.isLoading ||
      this.deleteRequest.isLoading
    );
  }
}
