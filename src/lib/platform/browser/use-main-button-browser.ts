import { platform, UseMainButtonType } from "../platform.ts";
import { useMount } from "../../react/use-mount.ts";
import { assert } from "../../typescript/assert.ts";
import { BrowserPlatform } from "./browser-platform.ts";

export const useMainButtonBrowser: UseMainButtonType = (
  text,
  onClick,
  condition,
) => {
  useMount(() => {
    assert(platform instanceof BrowserPlatform);
    platform.showMainButton(
      typeof text === "string" ? text : text(),
      onClick,
      condition,
    );

    return () => {
      assert(platform instanceof BrowserPlatform);
      platform.hideMainButton();
    };
  });
};
