import { useMount } from "../../react/use-mount.ts";
import WebApp from "@twa-dev/sdk";

export const useBackButtonTelegram = (fn: () => void) => {
  useMount(() => {
    WebApp.BackButton.show();
    WebApp.BackButton.onClick(fn);

    return () => {
      WebApp.BackButton.offClick(fn);
      WebApp.BackButton.hide();
    };
  });
};
