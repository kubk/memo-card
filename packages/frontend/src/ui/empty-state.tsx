import { ReactNode } from "react";
import { cn } from "./cn.ts";

export function EmptyState({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("w-full text-center mt-2 text-sm text-hint", className)}>
      {children}
    </div>
  );
}
