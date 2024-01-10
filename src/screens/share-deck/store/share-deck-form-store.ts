import { assert } from "../../../lib/typescript/assert.ts";
import { BooleanToggle } from "../../../lib/mobx-form/boolean-toggle.ts";
import { TextField } from "../../../lib/mobx-form/text-field.ts";
import { t } from "../../../translations/t.ts";
import { action, makeAutoObservable } from "mobx";
import { isFormValid } from "../../../lib/mobx-form/form-has-error.ts";
import { screenStore } from "../../../store/screen-store.ts";
import { redirectUserToDeckOrFolderLink } from "../redirect-user-to-deck-or-folder-link.tsx";
import {
  addDeckAccessRequest,
  getDeckAccessesOfDeckRequest,
} from "../../../api/api.ts";
import { persistableField } from "../../../lib/mobx-form/persistable-field.ts";
import { fromPromise, IPromiseBasedObservable } from "mobx-utils";
import { DeckAccessesResponse } from "../../../../functions/deck-accesses.ts";
import { DeckAccessType } from "../../../../functions/db/custom-types.ts";

const getRequestFiltersForScreen = () => {
  const screen = screenStore.screen;
  switch (screen.type) {
    case "shareDeck":
      return { deckId: screen.deckId.toString() };
    case "shareFolder":
      return { folderId: screen.folderId.toString() };
    default:
      assert(false, `Invalid screen type: ${screen.type}`);
  }
};

export class ShareDeckFormStore {
  isSending = false;
  deckAccesses?: IPromiseBasedObservable<DeckAccessesResponse>;
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

  constructor(public deckAccessType: DeckAccessType) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  load() {
    this.deckAccesses = fromPromise(
      getDeckAccessesOfDeckRequest(getRequestFiltersForScreen()),
    );
  }

  get isSaveButtonVisible() {
    return Boolean(this.form && isFormValid(this.form));
  }

  async shareDeckOrFolder() {
    const screen = screenStore.screen;
    assert(
      screen.type === "shareDeck" || screen.type === "shareFolder",
      "Screen type is not shareDeck or shareFolder",
    );
    const { shareId } = screen;

    if (!this.form.isOneTime.value) {
      redirectUserToDeckOrFolderLink(shareId);
      return;
    }

    this.isSending = true;

    addDeckAccessRequest({
      deckId: screen.type === "shareDeck" ? screen.deckId : null,
      folderId: screen.type === "shareFolder" ? screen.folderId : null,
      type: this.deckAccessType,
      durationDays: this.form.isAccessDuration.value
        ? Number(this.form.accessDurationLimitDays.value)
        : null,
    })
      .then((result) => {
        redirectUserToDeckOrFolderLink(result.share_id);
      })
      .finally(
        action(() => {
          this.isSending = false;
        }),
      );
  }
}
