import React, { useState } from "react";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import { theme } from "../../../ui/theme.tsx";
import { Button } from "../../../ui/button.tsx";
import { Flex } from "../../../ui/flex.tsx";
import { t } from "../../../translations/t.ts";
import { ShowConfirmType } from "../platform.ts";
import { css } from "@emotion/css";

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
          className={css({
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: theme.zIndex.confirmAlert,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          })}
        >
          <div
            className={css({
              backgroundColor: "white",
              width: 250,
              padding: 20,
              borderRadius: theme.borderRadius,
              textAlign: "center",
            })}
          >
            <p>{text}</p>
            <Flex gap={8}>
              <Button onClick={handleConfirm}>{t("confirm_ok")}</Button>
              <Button outline onClick={handleCancel}>
                {t("confirm_cancel")}
              </Button>
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
