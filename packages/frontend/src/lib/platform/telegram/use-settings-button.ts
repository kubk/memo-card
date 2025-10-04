import { useMount } from "../../react/use-mount.ts";
import { getWebAppOrNull } from "./telegram-web-app.ts";

export const useSettingsButton = (fn: () => void) => {
  useMount(() => {
    const webApp = getWebAppOrNull();
    if (!webApp) {
      return;
    }
    if (!webApp.isVersionAtLeast("7.0")) {
      return;
    }

    webApp.SettingsButton.show();
    webApp.SettingsButton.onClick(fn);

    return () => {
      webApp.SettingsButton.hide();
      webApp.SettingsButton.offClick(fn);
    };
  });
};
