import { ReactNode } from "react";
import { cn } from "../../ui/cn.ts";
import { BrowserBackButton } from "./browser-platform/browser-back-button.tsx";
import { platform } from "../../lib/platform/platform.ts";
import { BrowserPlatform } from "../../lib/platform/browser/browser-platform.ts";
import { TelegramPlatform } from "../../lib/platform/telegram/telegram-platform.ts";

type Props = {
  children: ReactNode;
  title?: string;
  subtitle?: ReactNode;
};

export function Screen(props: Props) {
  const { children, title, subtitle } = props;

  if (platform instanceof TelegramPlatform) {
    if (platform.isMobile()) {
      return (
        <div className="relative mb-4 flex flex-col gap-2 pb-[calc(var(--tg-content-safe-area-inset-bottom,0px)_+_4px)] pl-[calc(var(--tg-content-safe-area-inset-left,0px)_+_4px)] pr-[calc(var(--tg-content-safe-area-inset-right,0px)_+_4px)]">
          {title && (
            <h3 className="absolute inset-x-0 top-[calc(10px_-_var(--app-top-offset,12px))] text-center text-lg">
              {title}
            </h3>
          )}
          {subtitle}
          {children}
        </div>
      );
    }

    return (
      <div className="mb-4 flex flex-col gap-2">
        <div className="flex flex-col gap-2 pb-[calc(var(--tg-content-safe-area-inset-bottom,0px)_+_4px)] pl-[calc(var(--tg-content-safe-area-inset-left,0px)_+_4px)] pr-[calc(var(--tg-content-safe-area-inset-right,0px)_+_4px)]">
          {title && <h3 className="text-center text-lg">{title}</h3>}
          {subtitle}
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-2 relative",
        platform instanceof BrowserPlatform ? "mb-20" : "mb-4",
      )}
    >
      <div>
        <div className={cn("absolute -top-1")}>
          <BrowserBackButton />
        </div>
        {title && <h3 className="text-center text-lg">{title}</h3>}
        {subtitle}
      </div>
      <div className="flex flex-col gap-2 p-1">{children}</div>
    </div>
  );
}
