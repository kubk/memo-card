import { useMount } from "../../react/use-mount.ts";
import { autorun } from "mobx";
import { platform } from "../platform.ts";
import { assert } from "../../typescript/assert.ts";
import { BrowserPlatform } from "./browser-platform.ts";

export const useMainButtonProgressBrowser = (cb: () => boolean) => {
  useMount(() => {
    return autorun(() => {
      assert(platform instanceof BrowserPlatform);
      if (cb()) {
        platform.isMainButtonLoading.setTrue();
      } else {
        platform.isMainButtonLoading.setFalse();
      }
    });
  });
};
