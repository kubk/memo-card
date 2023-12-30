import { TextField } from "../../lib/mobx-form/text-field.ts";
import { validators } from "../../lib/mobx-form/validator.ts";
import { t } from "../../translations/t.ts";
import { action, makeAutoObservable } from "mobx";
import { screenStore } from "../../store/screen-store.ts";
import { assert } from "../../lib/typescript/assert.ts";
import {
  isFormTouched,
  isFormValid,
} from "../../lib/mobx-form/form-has-error.ts";
import { apiFolderUpsert } from "../../api/api.ts";
import { deckListStore } from "../../store/deck-list-store.ts";

const createFolderTitleField = (title: string) => {
  return new TextField(title, validators.required(t("validation_required")));
};

type FolderForm = {
  title: TextField<string>;
};

export class FolderFormStore {
  folderForm?: FolderForm;
  isSending = false;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  loadForm() {
    const screen = screenStore.screen;
    assert(screen.type === "folderForm");
    if (screen.folderId) {
      const folder = deckListStore.myFoldersAsDecks.find(
        (item) => item.id === screen.folderId,
      );
      console.log("folder", folder);
      assert(folder, "folder not found");
      this.folderForm = {
        title: createFolderTitleField(folder.name),
      };
    } else {
      this.folderForm = {
        title: createFolderTitleField(""),
      };
    }
  }

  onFolderSave() {
    if (!this.folderForm) {
      return;
    }
    if (!isFormValid(this.folderForm)) {
      return;
    }
    const screen = screenStore.screen;
    assert(screen.type === "folderForm");

    this.isSending = true;
    apiFolderUpsert({
      id: screen.folderId,
      title: this.folderForm.title.value,
    })
      .then(
        action(() => {
          // this.folderForm = createFolderForm();
          console.log("then");
        }),
      )
      .finally(
        action(() => {
          console.log("save");
          this.isSending = false;
        }),
      );
  }

  get isSaveButtonVisible() {
    return Boolean(
      this.folderForm &&
        isFormTouched(this.folderForm) &&
        isFormValid(this.folderForm),
    );
  }
}
