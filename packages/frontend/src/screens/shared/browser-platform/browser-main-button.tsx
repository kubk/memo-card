import { Button } from "../../../ui/button.tsx";
import { platform } from "../../../lib/platform/platform.ts";
import { BrowserPlatform } from "../../../lib/platform/browser/browser-platform.ts";
import { assert } from "api";
import { cn } from "../../../ui/cn.ts";
import { LoaderCircleIcon } from "lucide-react";

export function BrowserMainButton() {
  if (!(platform instanceof BrowserPlatform)) {
    return null;
  }

  if (!platform.isMainButtonVisible) {
    return null;
  }

  const { mainButtonInfo } = platform;
  assert(mainButtonInfo);

  if (mainButtonInfo.condition && !mainButtonInfo.condition()) {
    return null;
  }

  return (
    <div
      className={cn(
        "z-main-button max-w-2xl w-full fixed left-0 right-0 bottom-0 mx-auto box-border p-4 md:py-4 md:px-0",
      )}
    >
      <Button
        className="shadow-lg"
        disabled={platform.isMainButtonLoading.value}
        onClick={mainButtonInfo.onClick}
      >
        {platform.isMainButtonLoading.value ? (
          <LoaderCircleIcon className="animate-spin" />
        ) : (
          mainButtonInfo.text
        )}
      </Button>
    </div>
  );
}
