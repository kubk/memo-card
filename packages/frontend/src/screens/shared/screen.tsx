import { ReactNode } from "preact/compat";
import { cn } from "../../ui/cn.ts";
import { BrowserBackButton } from "./browser-platform/browser-back-button.tsx";
import { platform } from "../../lib/platform/platform.ts";
import { BrowserPlatform } from "../../lib/platform/browser/browser-platform.ts";
import { TelegramPlatform } from "../../lib/platform/telegram/telegram-platform.ts";

type Props = {
  children: ReactNode;
  title?: string;
  subtitle?: ReactNode;
  headerRight?: ReactNode;
};

export function Screen(props: Props) {
  const { children, title, subtitle, headerRight } = props;

  const isTelegram = platform instanceof TelegramPlatform;
  const isTelegramMobile = isTelegram && platform.isMobile;

  return (
    <div
      className={cn(
        "flex flex-col gap-2 relative",
        platform instanceof BrowserPlatform ? "mb-20" : "mb-4",
        isTelegram && "pb-1 px-1",
      )}
    >
      <div
        className={cn(
          "relative",
          isTelegramMobile &&
            "mt-[calc(10px_-_var(--app-top-offset,12px))] min-h-[calc(var(--app-top-offset,12px)_-_10px)]",
        )}
      >
        {!isTelegram && (
          <div className="absolute -top-1">
            <BrowserBackButton className="ml-2" />
          </div>
        )}
        {title && <h3 className="text-center text-lg">{title}</h3>}
        {headerRight ? (
          <div
            className={cn(
              "absolute z-20",
              isTelegram ? "right-0 top-0" : "right-1 -top-1",
            )}
          >
            {headerRight}
          </div>
        ) : null}
        {subtitle}
      </div>
      <div className={cn("flex flex-col gap-2", !isTelegram && "p-1")}>
        {children}
      </div>
    </div>
  );
}
