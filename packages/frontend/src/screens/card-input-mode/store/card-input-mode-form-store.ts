import { makeAutoObservable, reaction } from "mobx";
import { formToPlain, TextField, validators } from "mobx-form-lite";
import { notifyError, notifySuccess } from "../../shared/snackbar/snackbar.tsx";
import { DeckFormStore } from "../../deck-form/deck-form/store/deck-form-store.ts";
import { CardInputModeDb } from "api";
import { api } from "../../../api/trpc-api.ts";
import { t } from "../../../translations/t.ts";
import { showConfirm } from "../../../lib/platform/show-confirm.ts";
import { screenStore } from "../../../store/screen-store.ts";
import { makeQuery } from "../../../lib/mobx-query-lite/make-query.ts";
import { makeMutation } from "../../../lib/mobx-query-lite/make-mutation.ts";

export class CardInputModeFormStore {
  cardInputModesQuery = makeQuery({
    key: "cardInputMode.list",
    query: api.cardInputMode.list.query,
  });
  createMutation = makeMutation(api.cardInputMode.create.mutate);
  updateMutation = makeMutation(api.cardInputMode.update.mutate);
  deleteMutation = makeMutation(api.cardInputMode.delete.mutate);
  private isFormHydrated = false;

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

    reaction(
      () => this.cardInputMode,
      (mode) => {
        if (!mode || this.isFormHydrated) {
          return;
        }

        this.hydrateForm(mode);
      },
      { fireImmediately: true },
    );
  }

  get isEditing() {
    return !!this.deckFormStore.cardInputModeIdForForm;
  }

  get cardInputMode(): CardInputModeDb | null {
    if (!this.deckFormStore.cardInputModeIdForForm) return null;

    return (
      this.cardInputModes.find(
        (mode) => mode.id === this.deckFormStore.cardInputModeIdForForm,
      ) || null
    );
  }

  get cardInputModes() {
    return this.cardInputModesQuery.data ?? [];
  }

  get isLoadingCardInputMode() {
    return (
      this.isEditing &&
      this.cardInputModesQuery.data === undefined &&
      !this.cardInputModesQuery.error
    );
  }

  hydrateForm(mode: CardInputModeDb) {
    this.form.title.onChange(mode.title);
    this.form.prompt.onChange(mode.prompt);
    this.form.front.onChange(mode.front);
    this.form.back.onChange(mode.back);
    this.form.example.onChange(mode.example);
    this.isFormHydrated = true;
  }

  async submit() {
    if (this.isAnyRequestLoading) return;

    const data = formToPlain(this.form);

    try {
      if (this.deckFormStore.cardInputModeIdForForm) {
        const cardInputMode = await this.updateMutation.mutate({
          id: this.deckFormStore.cardInputModeIdForForm,
          ...data,
        });
        await this.updateCardInputModesCache(cardInputMode);
      } else {
        const cardInputMode = await this.createMutation.mutate(data);
        await this.updateCardInputModesCache(cardInputMode);
      }
    } catch (error) {
      notifyError(error);
      return;
    }

    notifySuccess(t("card_input_mode_form_save_success"));
    screenStore.back();
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

    try {
      const deletedCardInputMode = await this.deleteMutation.mutate({
        id: this.deckFormStore.cardInputModeIdForForm!,
      });
      await this.removeCardInputModeFromCache(deletedCardInputMode.id);
    } catch (error) {
      notifyError(error);
      return;
    }

    notifySuccess(t("card_input_mode_form_delete_success"));
    screenStore.back();
  }

  async updateCardInputModesCache(cardInputMode: CardInputModeDb) {
    const current = this.cardInputModesQuery.data;
    if (!current) {
      return;
    }

    const existingIndex = current.findIndex(
      (mode) => mode.id === cardInputMode.id,
    );
    if (existingIndex === -1) {
      await this.cardInputModesQuery.setData([...current, cardInputMode]);
      return;
    }

    await this.cardInputModesQuery.setData(
      current.map((mode) =>
        mode.id === cardInputMode.id ? cardInputMode : mode,
      ),
    );
  }

  async removeCardInputModeFromCache(cardInputModeId: string) {
    const current = this.cardInputModesQuery.data;
    if (!current) {
      return;
    }

    await this.cardInputModesQuery.setData(
      current.filter((mode) => mode.id !== cardInputModeId),
    );
  }

  get isAnyRequestLoading() {
    return (
      this.createMutation.isPending ||
      this.updateMutation.isPending ||
      this.deleteMutation.isPending
    );
  }
}
