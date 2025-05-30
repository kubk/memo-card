import { platform, UseBackButtonType } from "../platform.ts";
import { BrowserPlatform } from "./browser-platform.ts";
import { assert } from "api";
import { useEffect } from "react";

export const useBackButtonBrowser: UseBackButtonType = (
  onClick: () => void,
  deps = [],
) => {
  useEffect(() => {
    assert(platform instanceof BrowserPlatform);
    platform.showBackButton(onClick);

    return () => {
      assert(platform instanceof BrowserPlatform);
      platform.hideBackButton();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};
