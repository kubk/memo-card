import { useMount } from "../react/use-mount.ts";
import WebApp from "@twa-dev/sdk";
import { useHotkeys } from "react-hotkeys-hook";
import { autorun } from "mobx";

export const useMainButton = (
  text: string,
  onClick: () => void,
  condition?: () => boolean,
) => {
  let hideMainButton: () => void;

  useMount(() => {
    const stopAutoRun = autorun(() => {
      if (condition !== undefined) {
        if (!condition()) {
          return;
        }
      }

      WebApp.MainButton.show();
      WebApp.MainButton.setText(text);
      WebApp.MainButton.onClick(onClick);

      hideMainButton = () => {
        WebApp.MainButton.hide();
        WebApp.MainButton.offClick(onClick);
        WebApp.MainButton.hideProgress();
      };
    });

    return () => {
      stopAutoRun();
      hideMainButton?.();
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
