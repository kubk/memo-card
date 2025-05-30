import {
  BooleanToggle,
  formTouchAll,
  isFormValid,
  TextField,
} from "mobx-form-lite";
import { makeAutoObservable } from "mobx";
import { cardsFreezeRequest } from "../../../api/api.ts";
import { screenStore } from "../../../store/screen-store.ts";
import { showConfirm } from "../../../lib/platform/show-confirm.ts";
import { t } from "../../../translations/t.ts";
import { formatFrozenCards } from "../translations.ts";
import { RequestStore } from "../../../lib/mobx-request/request-store.ts";
import { notifyError, notifySuccess } from "../../shared/snackbar/snackbar.tsx";
import { assert } from "api";

export class FreezeCardsStore {
  cardsFreezeRequest = new RequestStore(cardsFreezeRequest);
  isHowOpen = new BooleanToggle(false);

  form = {
    freezeCardSelect: new TextField<number | null>(null, {
      afterChange: (value) => {
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
      afterChange: (value) => {
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
    if (this.isHowOpen.value) {
      return false;
    }

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

    assert(this.freezeDays !== null, "freezeDays is null");
    const result = await this.cardsFreezeRequest.execute({
      days: this.freezeDays,
    });
    if (result.status === "error") {
      notifyError({ info: "Error freezing cards", e: result.error });
      return;
    }

    const { frozenCards } = result.data;
    screenStore.go({ type: "main" });
    notifySuccess(formatFrozenCards(frozenCards));
  }
}
