import { ReactNode } from "react";
import { cn } from "../../ui/cn.ts";
import { BrowserBackButton } from "./browser-platform/browser-back-button.tsx";
import { platform } from "../../lib/platform/platform.ts";
import { BrowserPlatform } from "../../lib/platform/browser/browser-platform.ts";
import { userStore } from "../../store/user-store.ts";

type Props = {
  children: ReactNode;
  title: string;
  subtitle?: ReactNode;
};

export function Screen(props: Props) {
  const { children, title, subtitle } = props;

  return (
    <div
      className={cn(
        "flex flex-col gap-2 relative",
        platform instanceof BrowserPlatform ? "mb-20" : "mb-4",
      )}
    >
      <div>
        <div
          className={cn("absolute -top-1", {
            "left-0": !userStore.isRtl,
            "right-0": userStore.isRtl,
          })}
        >
          <BrowserBackButton />
        </div>
        <h3 className="text-center text-lg">{title}</h3>
        {subtitle}
      </div>
      {children}
    </div>
  );
}
