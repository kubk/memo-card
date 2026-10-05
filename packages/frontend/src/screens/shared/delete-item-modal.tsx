import { InfoIcon } from "lucide-react";
import { t } from "../../translations/t.ts";
import { Button } from "../../ui/button.tsx";
import { LoadingSwap } from "../../ui/loading-swap.tsx";
import {
  type DeleteItemModalStore,
  deleteItemModalStore,
} from "./delete-item-modal-store.ts";

type DeleteItemModalViewStore = Pick<
  DeleteItemModalStore,
  "form" | "isDeleting" | "close" | "submit"
> & {
  infoQuery: Pick<DeleteItemModalStore["infoQuery"], "data" | "isPending">;
};

const copyKeys = {
  deck: {
    description: "delete_item_description_deck",
    otherUsers: "delete_item_other_users_deck",
    publicCatalog: "delete_item_public_catalog_deck",
    removeForOthers: "delete_item_remove_for_others_deck",
    title: "delete_item_title_deck",
  },
  folder: {
    description: "delete_item_description_folder",
    otherUsers: "delete_item_other_users_folder",
    publicCatalog: "delete_item_public_catalog_folder",
    removeForOthers: "delete_item_remove_for_others_folder",
    title: "delete_item_title_folder",
  },
} as const;

function DeleteOption({
  checked,
  id,
  info,
  label,
  onCheckedChange,
}: {
  checked: boolean;
  id: string;
  info?: string;
  label: string;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="flex cursor-pointer items-start gap-3 rounded-xl bg-secondary-bg px-4 py-3.5"
        htmlFor={id}
      >
        <input
          type="checkbox"
          className="mt-0 size-5 shrink-0 cursor-pointer accent-button focus-visible:outline-2 focus-visible:outline-button"
          checked={checked}
          id={id}
          onChange={(event) => onCheckedChange(event.currentTarget.checked)}
        />
        <span className="text-sm font-medium leading-5 text-text">{label}</span>
      </label>
      {info ? (
        <span className="flex items-start gap-1.5 px-4 text-xs font-normal leading-4 text-hint">
          <InfoIcon className="mt-px shrink-0" size={14} />
          <span>{info}</span>
        </span>
      ) : null}
    </div>
  );
}

export function DeleteItemModal({
  store,
}: {
  store: DeleteItemModalViewStore;
}) {
  const form = store.form;
  if (!form) {
    return null;
  }

  const info = store.infoQuery.data;
  const keys = copyKeys[form.target.type];
  const hasDeleteOptions =
    info && (info.canRemoveForOtherUsers || info.canRemoveFromPublicCatalog);

  const close = () => {
    if (!store.isDeleting) {
      store.close();
    }
  };

  return (
    <div
      className="fixed inset-0 z-confirm-alert grid place-items-center bg-black/50 p-4"
      onClick={close}
    >
      <div
        className="flex w-full max-w-[425px] flex-col gap-5 rounded-2xl bg-bg p-5 text-text shadow"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="m-0 text-center text-xl font-semibold leading-snug">
          {t(keys.title)}
        </h2>
        <p className="m-0 text-sm leading-5 text-hint">{t(keys.description)}</p>

        {hasDeleteOptions ? (
          <div className="flex flex-col gap-3">
            {info.canRemoveForOtherUsers ? (
              <DeleteOption
                checked={form.removeForOtherUsers.value}
                id="delete-item-other-users"
                info={`${t(keys.otherUsers)}: ${info.otherUserCount}`}
                label={t(keys.removeForOthers)}
                onCheckedChange={form.removeForOtherUsers.setValue}
              />
            ) : null}
            {info.canRemoveFromPublicCatalog ? (
              <DeleteOption
                checked={form.removeFromPublicCatalog.value}
                id="delete-item-public-catalog"
                label={t(keys.publicCatalog)}
                onCheckedChange={form.removeFromPublicCatalog.setValue}
              />
            ) : null}
          </div>
        ) : null}

        <div className="flex gap-2 pb-1">
          <Button
            type="button"
            disabled={store.isDeleting}
            outline
            onClick={close}
          >
            {t("confirm_cancel")}
          </Button>
          <Button
            type="button"
            disabled={store.infoQuery.isPending || store.isDeleting}
            variant="danger"
            onClick={store.submit}
          >
            <LoadingSwap isLoading={store.isDeleting}>
              {t("delete")}
            </LoadingSwap>
          </Button>
        </div>
      </div>
    </div>
  );
}

export function DeleteItemModalContainer() {
  if (!deleteItemModalStore.isOpen) {
    return null;
  }

  return <DeleteItemModal store={deleteItemModalStore} />;
}
