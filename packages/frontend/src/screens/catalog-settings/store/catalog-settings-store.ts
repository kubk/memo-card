import {
  BooleanField,
  formTouchAll,
  isFormValid,
  TextField,
} from "mobx-form-lite";
import { RequestStore } from "../../../lib/mobx-request/request-store.ts";
import { makeAutoObservable } from "mobx";
import { CatalogItemSettingsResponse } from "api";
import {
  catalogItemSettingsGetRequest,
  updateCatalogItemSettingsRequest,
} from "../../../api/api.ts";
import { LanguageCatalogItemAvailableIn } from "api";
import { createCachedCategoriesRequest } from "../../../api/create-cached-categories-request.ts";
import { screenStore } from "../../../store/screen-store.ts";
import { notifyError, notifySuccess } from "../../shared/snackbar/snackbar.tsx";
import { assert } from "api";

export type CatalogSettingsForm = {
  isPublic: BooleanField;
  availableIn: TextField<LanguageCatalogItemAvailableIn | null>;
  categoryId: TextField<string | null>;
};

export class CatalogSettingsStore {
  form?: CatalogSettingsForm;
  catalogItemSettingsGetRequest = new RequestStore(
    catalogItemSettingsGetRequest,
  );
  categoriesRequest = createCachedCategoriesRequest();
  updateCatalogItemSettingsRequest = new RequestStore(
    updateCatalogItemSettingsRequest,
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

  createCatalogSettingsForm(input: CatalogItemSettingsResponse) {
    this.form = {
      isPublic: new BooleanField(input.is_public),
      availableIn: new TextField<LanguageCatalogItemAvailableIn | null>(
        input.available_in as LanguageCatalogItemAvailableIn | null,
      ),
      categoryId: new TextField<string | null>(input.category_id),
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
      category_id: this.form.categoryId.value,
      available_in: this.form.availableIn.value,
      is_public: this.form.isPublic.value,
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
