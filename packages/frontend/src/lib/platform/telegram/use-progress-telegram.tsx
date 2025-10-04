import { useMount } from "../../react/use-mount.ts";
import { autorun } from "mobx";
import { getWebAppOrNull } from "./telegram-web-app.ts";

export const useProgressTelegram = (cb: () => boolean) => {
  return useMount(() => {
    return autorun(() => {
      const webApp = getWebAppOrNull();
      if (cb()) {
        if (!webApp) return;
        webApp.MainButton.showProgress();
      } else {
        if (!webApp) return;
        webApp.MainButton.hideProgress();
      }
    });
  });
};
