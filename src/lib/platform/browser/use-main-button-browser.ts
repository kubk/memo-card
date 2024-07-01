import { platform, UseMainButtonType } from "../platform.ts";
import { useMount } from "../../react/use-mount.ts";
import { BrowserPlatform } from "./browser-platform.ts";
import { action, autorun, runInAction } from "mobx";
import { assert } from "../../../../shared/typescript/assert.ts";

export const useMainButtonBrowser: UseMainButtonType = (
  text,
  onClick,
  condition,
) => {
  const hideMainButton = action(() => {
    assert(platform instanceof BrowserPlatform);
    platform.hideMainButton();
  });

  useMount(() => {
    const stopAutoRun = autorun(() => {
      if (condition !== undefined && !condition()) {
        hideMainButton();
        return;
      }

      const buttonText = typeof text === "string" ? text : text();

      runInAction(() => {
        assert(platform instanceof BrowserPlatform);
        platform.showMainButton(buttonText, onClick, condition);
      });
    });

    return () => {
      hideMainButton();
      stopAutoRun();
    };
  });
};
