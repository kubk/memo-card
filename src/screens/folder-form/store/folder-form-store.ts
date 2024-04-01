import {
  formTouchAll,
  formUnTouchAll,
  isFormValid,
  ListField,
  TextField,
  validators,
} from "mobx-form-lite";
import { t } from "../../../translations/t.ts";
import { action, makeAutoObservable } from "mobx";
import { screenStore } from "../../../store/screen-store.ts";
import { assert } from "../../../lib/typescript/assert.ts";
import { decksMineRequest, folderUpsertRequest } from "../../../api/api.ts";
import { deckListStore } from "../../../store/deck-list-store.ts";
import {
  fromPromise,
  IPromiseBasedObservable,
} from "../../../lib/mobx-from-promise/from-promise.ts";
import { DeckWithoutCardsDbType } from "../../../../functions/db/deck/decks-with-cards-schema.ts";

const createFolderTitleField = (title: string) => {
  return new TextField(title, {
    validate: validators.required(t("validation_required")),
  });
};

const createDecksField = (decks: Array<{ id: number; name: string }>) => {
  return new ListField<{ id: number; name: string }>(decks, {
    validate: (value) => {
      if (value.length === 0) {
        return t("validation_at_least_one_deck");
      }
    },
  });
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
      decksMineRequest().then((response) => response.decks),
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
        decks: createDecksField(
          folder.decks.map((deck) => ({ id: deck.id, name: deck.name })),
        ),
      };
    } else {
      this.folderForm = {
        title: createFolderTitleField(""),
        description: new TextField(""),
        decks: createDecksField([]),
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
      formTouchAll(this.folderForm);
      return;
    }
    const screen = screenStore.screen;
    assert(screen.type === "folderForm");

    this.isSending = true;

    folderUpsertRequest({
      id: screen.folderId,
      title: this.folderForm.title.value,
      description: this.folderForm.description.value,
      deckIds: this.folderForm.decks.value.map((deck) => deck.id),
    })
      .then(({ folders, folder }) => {
        deckListStore.updateFolders(folders);
        assert(this.folderForm);
        formUnTouchAll(this.folderForm);
        screenStore.go({ type: "folderPreview", folderId: folder.id });
      })
      .finally(
        action(() => {
          this.isSending = false;
        }),
      );
  }
}
