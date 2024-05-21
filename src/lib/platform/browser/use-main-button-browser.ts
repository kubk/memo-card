import { platform, UseMainButtonType } from "../platform.ts";
import { useMount } from "../../react/use-mount.ts";
import { assert } from "../../typescript/assert.ts";
import { BrowserPlatform } from "./browser-platform.ts";
import { action, autorun, runInAction } from "mobx";

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

      runInAction(() => {
        assert(platform instanceof BrowserPlatform);
        platform.showMainButton(
          typeof text === "string" ? text : text(),
          onClick,
          condition,
        );
      });
    });

    return () => {
      hideMainButton();
      stopAutoRun();
    };
  });
};
