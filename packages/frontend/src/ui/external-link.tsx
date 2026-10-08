import type { ReactNode } from "preact/compat";
import { platform } from "../lib/platform/platform.ts";
import { cn } from "./cn.ts";

export function ExternalLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      onClick={() => {
        platform.openExternalLink(href);
      }}
      className={cn("cursor-pointer text-button", className)}
    >
      {children}
    </span>
  );
}
