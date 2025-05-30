import { useMount } from "../../react/use-mount.ts";
import { autorun } from "mobx";
import { getWebApp } from "./telegram-web-app.ts";

export const useProgressTelegram = (cb: () => boolean) => {
  return useMount(() => {
    return autorun(() => {
      if (cb()) {
        getWebApp().MainButton.showProgress();
      } else {
        getWebApp().MainButton.hideProgress();
      }
    });
  });
};
