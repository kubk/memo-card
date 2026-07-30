import { useHotkeys } from "react-hotkeys-hook";
import { autorun } from "mobx";
import { UseMainButtonType } from "../platform.ts";
import { useEffect } from "react";
import { getWebApp } from "./telegram-web-app.ts";

export const useMainButtonTelegram: UseMainButtonType = (
  text,
  onClick,
  condition,
  deps = [],
  options,
) => {
  const hideMainButton = () => {
    getWebApp().MainButton.hide();
    getWebApp().MainButton.offClick(onClick);
    getWebApp().MainButton.hideProgress();
  };

  useEffect(() => {
    const stopAutoRun = autorun(() => {
      if (condition !== undefined && !condition()) {
        hideMainButton();
        return;
      }

      getWebApp().MainButton.show();
      getWebApp().MainButton.setText(typeof text === "string" ? text : text());
      getWebApp().MainButton.onClick(onClick);
      if (options?.hasShineEffect) {
        getWebApp().MainButton.hasShineEffect = true;
      }
    });

    return () => {
      stopAutoRun();
      hideMainButton();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useHotkeys("enter", () => {
    if (condition !== undefined) {
      if (!condition()) {
        return;
      }
    }

    onClick();
  });
};
