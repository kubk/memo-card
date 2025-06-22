import {
  BooleanField,
  formTouchAll,
  isFormValid,
  TextField,
} from "mobx-form-lite";
import { RequestStore } from "../../../lib/mobx-request/request-store.ts";
import { makeAutoObservable } from "mobx";
import { LanguageCatalogItemAvailableIn, RouterOutput } from "api";
import { createCachedCategoriesRequest } from "../../../api/create-cached-categories-request.ts";
import { screenStore } from "../../../store/screen-store.ts";
import { notifyError, notifySuccess } from "../../shared/snackbar/snackbar.tsx";
import { assert } from "api";
import { api } from "../../../api/trpc-api.ts";

export type CatalogSettingsForm = {
  isPublic: BooleanField;
  availableIn: TextField<LanguageCatalogItemAvailableIn | null>;
  categoryId: TextField<string | null>;
};

export class CatalogSettingsStore {
  form?: CatalogSettingsForm;
  catalogItemSettingsGetRequest = new RequestStore(
    api.catalogItemSettings.get.query,
  );
  categoriesRequest = createCachedCategoriesRequest();
  updateCatalogItemSettingsRequest = new RequestStore(
    api.catalogItemSettings.update.mutate,
  );

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  async loadForm() {
    this.categoriesRequest.execute();

    const screen = screenStore.screen;
    assert(screen.type === "catalogSettings");

    const result = await this.catalogItemSettingsGetRequest.execute({
      type: screen.itemType,
      id: screen.id,
    });
    if (result.status === "error") {
      notifyError({
        e: result.error,
        info: "Failed to load catalog item setting",
      });
      return;
    }

    this.createCatalogSettingsForm(result.data);
  }

  createCatalogSettingsForm(input: RouterOutput["catalogItemSettings"]["get"]) {
    this.form = {
      isPublic: new BooleanField(input.isPublic),
      availableIn: new TextField<LanguageCatalogItemAvailableIn | null>(
        input.availableIn as LanguageCatalogItemAvailableIn | null,
      ),
      categoryId: new TextField<string | null>(input.categoryId),
    };
  }

  async submit() {
    if (!this.form) {
      return;
    }
    if (!isFormValid(this.form)) {
      formTouchAll(this.form);
      return;
    }

    const screen = screenStore.screen;
    assert(screen.type === "catalogSettings");

    const result = await this.updateCatalogItemSettingsRequest.execute({
      type: screen.itemType,
      id: screen.id,
      categoryId: this.form.categoryId.value,
      availableIn: this.form.availableIn.value,
      isPublic: this.form.isPublic.value,
    });

    if (result.status === "error") {
      notifyError({
        e: result.error,
        info: "Failed to update catalog item setting",
      });
      return;
    }

    notifySuccess("Catalog settings have been updated");
  }
}
