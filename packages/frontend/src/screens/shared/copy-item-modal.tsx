import { t } from "../../translations/t.ts";
import { Button } from "../../ui/button.tsx";
import { LoadingSwap } from "../../ui/loading-swap.tsx";
import { copyItemModalStore } from "./copy-item-modal-store.ts";
import { Modal } from "../../ui/modal.tsx";

export function CopyItemModalContainer() {
  const target = copyItemModalStore.target;
  if (!target) {
    return null;
  }

  return (
    <Modal title={t("copy_item_title")} onClose={copyItemModalStore.close}>
      <div className="flex flex-col gap-3 text-sm leading-5 text-hint">
        <p className="m-0">{t("copy_item_public")}</p>
        <p className="m-0">{t("copy_item_original")}</p>
      </div>

      <div className="flex gap-2 pb-1">
        <Button
          type="button"
          disabled={copyItemModalStore.isCopying}
          outline
          onClick={copyItemModalStore.close}
        >
          {t("confirm_cancel")}
        </Button>
        <Button
          type="button"
          disabled={copyItemModalStore.isCopying}
          onClick={copyItemModalStore.submit}
        >
          <LoadingSwap isLoading={copyItemModalStore.isCopying}>
            {t("make_copy")}
          </LoadingSwap>
        </Button>
      </div>
    </Modal>
  );
}
