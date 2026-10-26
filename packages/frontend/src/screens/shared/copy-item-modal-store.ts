import { type RouterInput } from "api";
import { makeAutoObservable } from "mobx";
import { api } from "../../api/trpc-api.ts";
import { makeMutation } from "../../lib/mobx-query-lite/make-mutation.ts";
import { showAlert } from "../../lib/platform/show-alert.ts";
import { reportHandledError } from "../../lib/rollbar/rollbar.tsx";
import { deckListStore } from "../../store/deck-list-store.ts";
import { screenStore } from "../../store/screen-store.ts";
import { t } from "../../translations/t.ts";

type LibraryItemCopyTarget = RouterInput["libraryItem"]["copy"];

class CopyItemModalStore {
  target: LibraryItemCopyTarget | null = null;
  copyMutation = makeMutation(api.libraryItem.copy.mutate);

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get isCopying() {
    return this.copyMutation.isPending;
  }

  open(target: LibraryItemCopyTarget) {
    this.target = target;
  }

  close() {
    if (this.isCopying) {
      return;
    }

    this.target = null;
  }

  async submit() {
    const target = this.target;
    if (!target || this.isCopying) {
      return;
    }

    const result = await this.copyMutation.mutateResult(target);
    if (!result.ok) {
      reportHandledError(`Unable to copy ${target.type}`, result.error, target);
      showAlert(t("error_contact_support"));
      return;
    }

    await deckListStore.myInfoQuery.invalidate({ refetchInactive: true });
    const copy = result.data;
    this.close();
    if (copy.type === "deck") {
      screenStore.replace({ type: "deckPreview", deckId: copy.deckId });
      screenStore.push({ type: "deckForm", deckId: copy.deckId });
    } else {
      screenStore.replace({ type: "folderPreview", folderId: copy.folderId });
      screenStore.push({ type: "folderForm", folderId: copy.folderId });
    }
  }
}

export const copyItemModalStore = new CopyItemModalStore();
