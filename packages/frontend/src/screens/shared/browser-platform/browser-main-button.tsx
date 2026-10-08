import { Button } from "../../../ui/button.tsx";
import { platform } from "../../../lib/platform/platform.ts";
import { BrowserPlatform } from "../../../lib/platform/browser/browser-platform.ts";
import { cn } from "../../../ui/cn.ts";
import { LoaderCircleIcon } from "lucide-react";
import { overlayStore } from "../../../store/overlay-store.ts";

export function BrowserMainButton() {
  if (!(platform instanceof BrowserPlatform)) {
    return null;
  }

  const { mainButtonInfo } = platform;
  if (!mainButtonInfo) {
    return null;
  }

  if (overlayStore.isOpen && !mainButtonInfo.isAboveBottomSheet) {
    return null;
  }

  if (mainButtonInfo.condition && !mainButtonInfo.condition()) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed bottom-safe-control left-0 right-0 mx-auto box-border w-full max-w-2xl px-4 md:px-0",
        mainButtonInfo.isAboveBottomSheet ? "z-[1001]" : "z-main-button",
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
