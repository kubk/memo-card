import { useState } from "react";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import { Button } from "../../../ui/button.tsx";
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
        <div
          className="fixed inset-0 z-confirm-alert bg-black/50 flex justify-center items-center"
        >
          <div className="w-[calc(100%_-_32px)] max-w-[425px] rounded-2xl bg-bg px-5 py-7 text-center">
            <p className="text-xl font-semibold leading-snug">{text}</p>
            <div className="mt-6 flex gap-2">
              <Button outline onClick={handleCancel}>
                {t("confirm_cancel")}
              </Button>
              <Button onClick={handleConfirm}>{t("confirm_ok")}</Button>
            </div>
          </div>
        </div>,
        document.body,
      );
    };

    const element = document.createElement("div");
    createRoot(element).render(<Confirmation />);
  });
};
