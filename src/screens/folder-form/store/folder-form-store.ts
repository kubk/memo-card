import { TextField } from "../../../lib/mobx-form/text-field.ts";
import { validators } from "../../../lib/mobx-form/validator.ts";
import { t } from "../../../translations/t.ts";
import { action, makeAutoObservable } from "mobx";
import { screenStore } from "../../../store/screen-store.ts";
import { assert } from "../../../lib/typescript/assert.ts";
import {
  formUnTouchAll,
  isFormTouched,
  isFormValid,
} from "../../../lib/mobx-form/form-has-error.ts";
import { apiDecksMine, apiFolderUpsert } from "../../../api/api.ts";
import { deckListStore } from "../../../store/deck-list-store.ts";
import { ListField } from "../../../lib/mobx-form/list-field.ts";
import { fromPromise, IPromiseBasedObservable } from "mobx-utils";
import { DeckWithoutCardsDbType } from "../../../../functions/db/deck/decks-with-cards-schema.ts";

const createFolderTitleField = (title: string) => {
  return new TextField(title, validators.required(t("validation_required")));
};

type FolderForm = {
  title: TextField<string>;
  description: TextField<string>;
  decks: ListField<{ id: number; name: string }>;
};

export class FolderFormStore {
  folderForm?: FolderForm;
  isSending = false;
  decksMine?: IPromiseBasedObservable<DeckWithoutCardsDbType[]>;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  loadForm() {
    const screen = screenStore.screen;
    assert(screen.type === "folderForm");

    this.decksMine = fromPromise(
      apiDecksMine().then((response) => response.decks),
    );

    if (screen.folderId) {
      assert(screen.folderId, "folderId is not set");
      const folder = deckListStore.myFoldersAsDecks.find(
        (item) => item.id === screen.folderId,
      );
      assert(folder, "folder not found");
      assert(folder.type === "folder");

      this.folderForm = {
        title: createFolderTitleField(folder.name),
        description: new TextField(folder.description ?? ""),
        decks: new ListField(
          folder.decks.map((deck) => ({ id: deck.id, name: deck.name })),
        ),
      };
    } else {
      this.folderForm = {
        title: createFolderTitleField(""),
        description: new TextField(""),
        decks: new ListField<{ id: number; name: string }>([]),
      };
    }
  }

  get decksMineFiltered() {
    if (this.decksMine?.state !== "fulfilled") {
      return [];
    }
    const deckIdsAdded =
      this.folderForm?.decks.value.map((deck) => deck.id) || [];

    return this.decksMine.value.filter((deck) => {
      return !deckIdsAdded.includes(deck.id);
    });
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
      description: this.folderForm.description.value,
      deckIds: this.folderForm.decks.value.map((deck) => deck.id),
    })
      .then(({ folders }) => {
        deckListStore.optimisticUpdateFolders(folders);
        assert(this.folderForm);
        formUnTouchAll(this.folderForm);
      })
      .finally(
        action(() => {
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
