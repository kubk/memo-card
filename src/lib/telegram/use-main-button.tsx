import { useMount } from "../react/use-mount.ts";
import WebApp from "@twa-dev/sdk";
import { useHotkeys } from "react-hotkeys-hook";
import { autorun } from "mobx";

export const useMainButton = (
  text: string,
  onClick: () => void,
  condition?: () => boolean,
) => {
  const hideMainButton = () => {
    WebApp.MainButton.hide();
    WebApp.MainButton.offClick(onClick);
    WebApp.MainButton.hideProgress();
  };

  useMount(() => {
    const stopAutoRun = autorun(() => {
      if (condition !== undefined && !condition()) {
        hideMainButton();
        return;
      }

      WebApp.MainButton.show();
      WebApp.MainButton.setText(text);
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
