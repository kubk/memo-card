import { platform } from "../../../lib/platform/platform.ts";
import { BrowserPlatform } from "../../../lib/platform/browser/browser-platform.ts";
import { assert } from "api";
import { ArrowLeftCircle } from "lucide-react";

export function BrowserBackButton() {
  if (!(platform instanceof BrowserPlatform)) {
    return null;
  }

  return (
    <div className="flex justify-between">
      {platform.isBackButtonVisible ? (
        <ArrowLeftCircle
          className="text-hint cursor-pointer mt-1.5"
          size={24}
          onClick={() => {
            assert(platform instanceof BrowserPlatform);
            platform.backButtonInfo?.onClick();
          }}
        />
      ) : null}
    </div>
  );
}
