import { assert, type RouterInput } from "api";
import { makeAutoObservable } from "mobx";
import { BooleanField } from "mobx-form-lite";
import { api } from "../../api/trpc-api.ts";
import { makeMutation, makeQuery } from "mobx-query-lite";
import { platform } from "../../lib/platform/platform.ts";
import { notifyError } from "./snackbar/snackbar.tsx";
import { deckListStore } from "../../store/deck-list-store.ts";
import { screenStore } from "../../store/screen-store.ts";

type LibraryItemDeleteTarget = RouterInput["libraryItem"]["deletionInfo"];

function getLibraryItemId(target: LibraryItemDeleteTarget) {
  switch (target.type) {
    case "deck":
      return target.deckId;
    case "folder":
      return target.folderId;
    default:
      return target satisfies never;
  }
}

export class DeleteItemModalStore {
  form: {
    target: LibraryItemDeleteTarget;
    removeForOtherUsers: BooleanField;
  } | null = null;
  infoQuery = makeQuery(
    () => {
      const form = this.form;
      assert(form);
      const target = form.target;
      const targetId = getLibraryItemId(target);

      return {
        key: `libraryItem.deletionInfo:${target.type}:${targetId}`,
        query: () => api.libraryItem.deletionInfo.query(target),
      };
    },
    { staleTime: 0 },
  );
  deleteMutation = makeMutation(
    async (input: RouterInput["libraryItem"]["delete"]) => {
      await api.libraryItem.delete.mutate(input);
      await deckListStore.myInfoQuery.invalidate({ refetchInactive: true });
    },
  );

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get isOpen() {
    return !!this.form;
  }

  get isDeleting() {
    return this.deleteMutation.isPending;
  }

  open(target: LibraryItemDeleteTarget) {
    this.form = {
      target,
      removeForOtherUsers: new BooleanField(false),
    };
  }

  close() {
    if (this.deleteMutation.isPending) {
      return;
    }

    this.form = null;
  }

  async submit() {
    const form = this.form;
    if (!form || this.isDeleting || this.infoQuery.isPending) {
      return;
    }

    const target = form.target;
    platform.haptic("heavy");
    const result = await this.deleteMutation.mutateResult({
      ...target,
      removeForOtherUsers: form.removeForOtherUsers.value,
    });
    if (!result.ok) {
      const targetId = getLibraryItemId(target);
      notifyError({
        e: result.error,
        info: `Unable to remove ${target.type} ${targetId}`,
      });
      return;
    }

    this.form = null;
    screenStore.push({ type: "main" });
  }
}

export const deleteItemModalStore = new DeleteItemModalStore();
