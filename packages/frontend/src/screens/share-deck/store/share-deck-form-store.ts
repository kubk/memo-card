import { BooleanToggle, isFormValid, TextField } from "mobx-form-lite";
import { t } from "../../../translations/t.ts";
import { makeAutoObservable } from "mobx";
import { screenStore } from "../../../store/screen-store.ts";
import { shareMemoCardUrl } from "../share-memo-card-url.tsx";
import {
  addDeckAccessRequest,
  getDeckAccessesOfDeckRequest,
} from "../../../api/api.ts";
import { DeckAccessType } from "api";
import { persistableField } from "../../../lib/mobx-form-lite-persistable/persistable-field.ts";
import { RequestStore } from "../../../lib/mobx-request/request-store.ts";
import { notifyError } from "../../shared/snackbar/snackbar.tsx";
import { assert } from "api";

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
  isDeckAccessesOpen = new BooleanToggle(false);
  deckAccessesRequest = new RequestStore(getDeckAccessesOfDeckRequest);
  addDeckAccessRequest = new RequestStore(addDeckAccessRequest);

  form = {
    isOneTime: persistableField(new BooleanToggle(false), "isOneTime"),
    isAccessDuration: persistableField(
      new BooleanToggle(false),
      "accessDurationLimit",
    ),
    accessDurationLimitDays: persistableField(
      new TextField("30", {
        validate: (value: unknown) => {
          if (this.form.isAccessDuration.value) {
            if (!value) {
              return t("validation_required");
            }
            if (isNaN(Number(value)) || Number(value) < 1) {
              return t("validation_number");
            }
          }
        },
      }),
      "accessDurationLimitDays",
    ),
  };

  constructor(public deckAccessType: DeckAccessType) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  load() {
    this.deckAccessesRequest.execute(getRequestFiltersForScreen());
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
      shareMemoCardUrl(shareId);
      return;
    }

    const deckId = screen.type === "shareDeck" ? screen.deckId : null;
    const folderId = screen.type === "shareFolder" ? screen.folderId : null;

    const result = await this.addDeckAccessRequest.execute({
      deckId,
      folderId,
      type: this.deckAccessType,
      durationDays: this.form.isAccessDuration.value
        ? Number(this.form.accessDurationLimitDays.value)
        : null,
    });

    if (result.status === "error") {
      notifyError({
        info: "Error sharing deck or folder",
        e: result.error,
        deckId,
        folderId,
      });
      return;
    }

    shareMemoCardUrl(result.data.share_id);
  }
}
