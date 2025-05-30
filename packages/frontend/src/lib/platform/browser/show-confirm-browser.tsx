import { useState } from "react";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import { theme } from "../../../ui/theme.tsx";
import { Button } from "../../../ui/button.tsx";
import { Flex } from "../../../ui/flex.tsx";
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
          style={{ zIndex: theme.zIndex.confirmAlert }}
          className="fixed inset-0 bg-black/50 flex justify-center items-center"
        >
          <div className="bg-bg w-[250px] p-5 rounded-xl text-center">
            <p>{text}</p>
            <Flex gap={8} mt={16}>
              <Button outline onClick={handleCancel}>
                {t("confirm_cancel")}
              </Button>
              <Button onClick={handleConfirm}>{t("confirm_ok")}</Button>
            </Flex>
          </div>
        </div>,
        document.body,
      );
    };

    const element = document.createElement("div");
    createRoot(element).render(<Confirmation />);
  });
};
