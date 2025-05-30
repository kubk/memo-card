import { platform, UseMainButtonType } from "../platform.ts";
import { BrowserPlatform } from "./browser-platform.ts";
import { action, autorun, runInAction } from "mobx";
import { assert } from "api";
import { useEffect } from "react";

export const useMainButtonBrowser: UseMainButtonType = (
  text,
  onClick,
  condition,
  deps = [],
) => {
  const hideMainButton = action(() => {
    assert(platform instanceof BrowserPlatform);
    platform.hideMainButton();
  });

  useEffect(() => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};
