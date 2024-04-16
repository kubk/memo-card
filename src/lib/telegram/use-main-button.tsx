import { useMount } from "../react/use-mount.ts";
import WebApp from "@twa-dev/sdk";
import { useHotkeys } from "react-hotkeys-hook";
import { autorun } from "mobx";

// Track visible state to avoid flickering
let isVisible = false;

export const useMainButton = (
  text: string | (() => string),
  onClick: () => void,
  condition?: () => boolean,
) => {
  const hideMainButton = () => {
    // Avoid flickering of the Telegram main button
    isVisible = false;
    setTimeout(() => {
      if (isVisible) {
        return;
      }
      WebApp.MainButton.hide();
      isVisible = false;
    }, 300);

    WebApp.MainButton.offClick(onClick);
    WebApp.MainButton.hideProgress();
  };

  useMount(() => {
    const stopAutoRun = autorun(() => {
      if (condition !== undefined && !condition()) {
        hideMainButton();
        return;
      }

      isVisible = true;
      WebApp.MainButton.show();
      WebApp.MainButton.setText(typeof text === "string" ? text : text());
      WebApp.MainButton.onClick(onClick);
    });

    return () => {
      stopAutoRun();
      hideMainButton();
    };
  });

  useHotkeys("enter", () => {
    if (condition !== undefined) {
      if (!condition()) {
        return;
      }
    }

    onClick();
  });
};
