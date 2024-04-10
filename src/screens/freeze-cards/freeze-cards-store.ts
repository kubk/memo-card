import { formTouchAll, isFormValid, TextField } from "mobx-form-lite";
import { action, makeAutoObservable, runInAction } from "mobx";
import { cardsFreezeRequest } from "../../api/api.ts";
import { assert } from "../../lib/typescript/assert.ts";
import { reportHandledError } from "../../lib/rollbar/rollbar.tsx";
import { showAlert } from "../../lib/telegram/show-alert.ts";
import { screenStore } from "../../store/screen-store.ts";
import { hapticImpact } from "../../lib/telegram/haptics.ts";
import { showConfirm } from "../../lib/telegram/show-confirm.ts";
import { t } from "../../translations/t.ts";
import { formatFrozenCards } from "./translations.ts";

export class FreezeCardsStore {
  isLoading = false;
  form = {
    freezeCardSelect: new TextField<number | null>(null, {
      onChangeCallback: (value) => {
        if (value) {
          this.form.freezeCardInput.onChange("");
        }
      },
    }),
    freezeCardInput: new TextField("", {
      validate: (value) => {
        if (value === "") {
          return;
        }
        if (isNaN(Number(value)) || Number(value) <= 0) {
          return t("validate_positive");
        }
        if (Number(value) >= 100) {
          return t("validate_under_100");
        }
      },
      onChangeCallback: (value) => {
        if (!this.form.freezeCardInput.error && value) {
          this.form.freezeCardSelect.onChange(null);
        }
      },
    }),
  };

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get freezeDays(): number | null {
    if (
      this.form.freezeCardInput.value !== "" &&
      !this.form.freezeCardInput.error
    ) {
      return Number(this.form.freezeCardInput.value);
    }
    if (this.form.freezeCardSelect.value !== null) {
      return this.form.freezeCardSelect.value;
    }
    return null;
  }

  get isFreezeButtonVisible() {
    return (
      this.form.freezeCardSelect.value !== null ||
      this.form.freezeCardInput.value !== ""
    );
  }

  async freeze() {
    if (!this.isFreezeButtonVisible) {
      return;
    }
    if (!isFormValid(this.form)) {
      formTouchAll(this.form);
      return;
    }

    const isConfirmed = await showConfirm(t("freeze_confirm_freeze"));
    if (!isConfirmed) {
      return;
    }

    runInAction(() => {
      this.isLoading = true;
    });
    assert(this.freezeDays !== null, "freezeDays is null");
    cardsFreezeRequest({ days: this.freezeDays })
      .then(({ frozenCards }) => {
        screenStore.go({ type: "main" });
        hapticImpact("heavy");
        showAlert(formatFrozenCards(frozenCards));
      })
      .catch((error) => {
        reportHandledError("Failed to freeze cards", error);
        showAlert(t("freeze_error"));
      })
      .finally(
        action(() => {
          this.isLoading = false;
        }),
      );
  }
}
