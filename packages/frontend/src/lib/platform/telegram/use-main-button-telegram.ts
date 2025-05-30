import { useHotkeys } from "react-hotkeys-hook";
import { autorun } from "mobx";
import { UseMainButtonType } from "../platform.ts";
import { useEffect } from "react";
import { getWebApp } from "./telegram-web-app.ts";

// Track visible state to avoid flickering
let isVisible = false;

const hide = (forceHide = false) => {
  if (
    forceHide ||
    (getWebApp().platform !== "ios" && getWebApp().platform !== "android")
  ) {
    getWebApp().MainButton.hide();
    isVisible = false;
    return;
  }

  // Avoid flickering of the Telegram main button
  isVisible = false;
  setTimeout(() => {
    if (isVisible) {
      return;
    }
    getWebApp().MainButton.hide();
    isVisible = false;
  }, 100);
};

export const useMainButtonTelegram: UseMainButtonType = (
  text,
  onClick,
  condition,
  deps = [],
  options,
) => {
  const hideMainButton = () => {
    hide(!!options?.forceHide);
    getWebApp().MainButton.offClick(onClick);
    getWebApp().MainButton.hideProgress();
  };

  useEffect(() => {
    const stopAutoRun = autorun(() => {
      if (condition !== undefined && !condition()) {
        hideMainButton();
        return;
      }

      isVisible = true;
      getWebApp().MainButton.show();
      getWebApp().MainButton.setText(typeof text === "string" ? text : text());
      getWebApp().MainButton.onClick(onClick);
      if (options?.hasShineEffect) {
        // @ts-expect-error
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
