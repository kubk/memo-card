import { useMount } from "../react/use-mount.ts";
import WebApp from "@twa-dev/sdk";

export const useMainButton = (
  text: string,
  onClick: () => void,
  condition?: () => boolean,
) => {
  useMount(() => {
    if (condition !== undefined) {
      if (!condition()) {
        return;
      }
    }

    WebApp.MainButton.show();
    WebApp.MainButton.setText(text);
    WebApp.MainButton.onClick(onClick);

    return () => {
      WebApp.MainButton.hide();
      WebApp.MainButton.offClick(onClick);
      WebApp.MainButton.hideProgress();
    };
  });
};
