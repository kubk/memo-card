import { useMount } from "../../react/use-mount.ts";
import { getWebApp } from "./telegram-web-app.ts";

export const useSettingsButton = (fn: () => void) => {
  useMount(() => {
    if (!getWebApp().isVersionAtLeast("7.0")) {
      return;
    }

    getWebApp().SettingsButton.show();
    getWebApp().SettingsButton.onClick(fn);

    return () => {
      getWebApp().SettingsButton.hide();
      getWebApp().SettingsButton.offClick(fn);
    };
  });
};
