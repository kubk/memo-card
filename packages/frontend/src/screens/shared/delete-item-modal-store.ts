import { assert, type RouterInput } from "api";
import { makeAutoObservable, runInAction } from "mobx";
import { BooleanField } from "mobx-form-lite";
import { api } from "../../api/trpc-api.ts";
import { makeMutation } from "../../lib/mobx-query-lite/make-mutation.ts";
import { makeQuery } from "../../lib/mobx-query-lite/make-query.ts";
import { platform } from "../../lib/platform/platform.ts";
import { reportHandledError } from "../../lib/rollbar/rollbar.tsx";
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
    removeFromPublicCatalog: BooleanField;
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
  deleteMutation = makeMutation(api.libraryItem.delete.mutate);

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get isOpen() {
    return !!this.form;
  }

  get info() {
    return this.infoQuery.data;
  }

  get infoError() {
    return this.infoQuery.error;
  }

  get isDeleting() {
    return this.deleteMutation.isPending;
  }

  open(target: LibraryItemDeleteTarget) {
    this.form = {
      target,
      removeForOtherUsers: new BooleanField(false),
      removeFromPublicCatalog: new BooleanField(false),
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
    if (!form || this.isDeleting) {
      return;
    }

    const info = this.info;
    if (!info) {
      return;
    }

    const target = form.target;
    platform.haptic("heavy");
    const result = await this.deleteMutation.mutateResult({
      ...target,
      removeForOtherUsers: form.removeForOtherUsers.value,
      removeFromPublicCatalog: form.removeFromPublicCatalog.value,
    });
    if (!result.ok) {
      const targetId = getLibraryItemId(target);
      reportHandledError(
        `Unable to remove ${target.type} ${targetId}`,
        result.error,
      );
      return;
    }

    await deckListStore.myInfoQuery.invalidate({ refetchInactive: true });
    runInAction(() => {
      this.form = null;
      screenStore.push({ type: "main" });
    });
  }
}

export const deleteItemModalStore = new DeleteItemModalStore();
