import { platform } from "../../../lib/platform/platform.ts";
import { BrowserPlatform } from "../../../lib/platform/browser/browser-platform.ts";
import { assert } from "api";
import { ArrowLeftCircle } from "lucide-react";
import { cn } from "../../../ui/cn.ts";
import { userStore } from "../../../store/user-store.ts";

export function BrowserBackButton({ className }: { className?: string }) {
  if (!(platform instanceof BrowserPlatform)) {
    return null;
  }

  return (
    <div className="flex justify-between">
      {platform.isBackButtonVisible ? (
        <ArrowLeftCircle
          className={cn(
            "text-hint cursor-pointer mt-1.5",
            userStore.isRtl && "rotate-180",
            className,
          )}
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
