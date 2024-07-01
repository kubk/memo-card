import { platform } from "../platform.ts";
import { useMount } from "../../react/use-mount.ts";
import { BrowserPlatform } from "./browser-platform.ts";
import { assert } from "../../../../shared/typescript/assert.ts";

export const useBackButtonBrowser = (onClick: () => void) => {
  useMount(() => {
    assert(platform instanceof BrowserPlatform);
    platform.showBackButton(onClick);

    return () => {
      assert(platform instanceof BrowserPlatform);
      platform.hideBackButton();
    };
  });
};
