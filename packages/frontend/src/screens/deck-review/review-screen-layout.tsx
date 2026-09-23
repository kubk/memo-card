import { ReactNode } from "react";

export function ReviewScreenLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex h-[calc(var(--tg-viewport-height,100vh)_-_var(--tg-safe-area-inset-top,0px)_-_var(--tg-safe-area-inset-bottom,0px)_-_var(--app-top-offset,12px))] flex-col items-center justify-center overflow-hidden">
      {children}
    </div>
  );
}
