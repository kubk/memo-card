import { useMount } from "../react/use-mount.ts";
import { autorun } from "mobx";
import WebApp from "@twa-dev/sdk";

export const useTelegramProgress = (cb: () => boolean) => {
  return useMount(() => {
    return autorun(() => {
      if (cb()) {
        WebApp.MainButton.showProgress();
      } else {
        WebApp.MainButton.hideProgress();
      }
    });
  });
};
