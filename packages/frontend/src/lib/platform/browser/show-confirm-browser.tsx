import { useState } from "preact/compat";
import ReactDOM from "preact/compat";
import { createRoot } from "preact/compat/client";
import { Button } from "../../../ui/button.tsx";
import { Modal } from "../../../ui/modal.tsx";
import { t } from "../../../translations/t.ts";
import { ShowConfirmType } from "../platform.ts";

export const showConfirmBrowser: ShowConfirmType = (text) => {
  return new Promise((resolve) => {
    const Confirmation = () => {
      const [isOpen, setIsOpen] = useState(true);

      const handleConfirm = () => {
        setIsOpen(false);
        resolve(true);
      };

      const handleCancel = () => {
        setIsOpen(false);
        resolve(false);
      };

      if (!isOpen) {
        return null;
      }

      return ReactDOM.createPortal(
        <Modal title={text} onClose={handleCancel}>
          <div className="flex gap-2 pb-1">
            <Button outline onClick={handleCancel}>
              {t("confirm_cancel")}
            </Button>
            <Button onClick={handleConfirm}>{t("confirm_ok")}</Button>
          </div>
        </Modal>,
        document.body,
      );
    };

    const element = document.createElement("div");
    createRoot(element).render(<Confirmation />);
  });
};
