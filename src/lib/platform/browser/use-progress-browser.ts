import { useMount } from "../../react/use-mount.ts";
import { autorun, runInAction } from "mobx";
import { platform } from "../platform.ts";
import { BrowserPlatform } from "./browser-platform.ts";
import { assert } from "../../../../shared/typescript/assert.ts";

export const useProgressBrowser = (cb: () => boolean) => {
  useMount(() => {
    return autorun(() => {
      if (cb()) {
        runInAction(() => {
          assert(platform instanceof BrowserPlatform);
          platform.isMainButtonLoading.setTrue();
        });
      } else {
        runInAction(() => {
          assert(platform instanceof BrowserPlatform);
          platform.isMainButtonLoading.setFalse();
        });
      }
    });
  });
};
