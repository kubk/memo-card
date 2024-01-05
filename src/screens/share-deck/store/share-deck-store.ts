import { assert } from "../../../lib/typescript/assert.ts";
import { BooleanToggle } from "../../../lib/mobx-form/boolean-toggle.ts";
import { TextField } from "../../../lib/mobx-form/text-field.ts";
import { t } from "../../../translations/t.ts";
import { action, makeAutoObservable } from "mobx";
import { isFormValid } from "../../../lib/mobx-form/form-has-error.ts";
import { screenStore } from "../../../store/screen-store.ts";
import { redirectUserToDeckLink } from "../redirect-user-to-deck-link.tsx";
import {
  addDeckAccessRequest,
  getDeckAccessesOfDeckRequest,
} from "../../../api/api.ts";
import { persistableField } from "../../../lib/mobx-form/persistable-field.ts";
import { fromPromise, IPromiseBasedObservable } from "mobx-utils";
import { DeckAccessesForDeckTypeDb } from "../../../../functions/deck-accesses.ts";

export class ShareDeckStore {
  isSending = false;
  deckAccesses?: IPromiseBasedObservable<DeckAccessesForDeckTypeDb>;
  isDeckAccessesOpen = new BooleanToggle(false);

  form = {
    isOneTime: persistableField(new BooleanToggle(false), "isOneTime"),
    isAccessDuration: persistableField(
      new BooleanToggle(false),
      "accessDurationLimit",
    ),
    accessDurationLimitDays: persistableField(
      new TextField("30", (value: unknown) => {
        if (this.form.isAccessDuration.value) {
          if (!value) {
            return t("validation_required");
          }
          if (isNaN(Number(value)) || Number(value) < 1) {
            return t("validation_number");
          }
        }
      }),
      "accessDurationLimitDays",
    ),
  };

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  load() {
    const screen = screenStore.screen;
    assert(screen.type === "shareDeck", "Screen is not shareDeck");
    const { deckId } = screen;

    this.deckAccesses = fromPromise(getDeckAccessesOfDeckRequest(deckId));
  }

  get isSaveButtonVisible() {
    return Boolean(this.form && isFormValid(this.form));
  }

  async shareDeck() {
    const screen = screenStore.screen;
    assert(screen.type === "shareDeck", "Screen is not shareDeck");
    const { deckId, shareId } = screen;

    if (!this.form.isOneTime.value) {
      redirectUserToDeckLink(shareId);
      return;
    }

    this.isSending = true;

    addDeckAccessRequest({
      deckId,
      durationDays: this.form.isAccessDuration.value
        ? Number(this.form.accessDurationLimitDays.value)
        : null,
    })
      .then((result) => {
        redirectUserToDeckLink(result.share_id);
      })
      .finally(
        action(() => {
          this.isSending = false;
        }),
      );
  }
}
