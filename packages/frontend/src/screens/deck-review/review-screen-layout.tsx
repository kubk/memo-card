import { ReactNode } from "preact/compat";

export function ReviewScreenLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex h-[calc(var(--app-viewport-height)_-_var(--app-safe-area-top)_-_var(--app-route-bottom-inset)_-_var(--app-top-offset,12px))] flex-col items-center justify-center overflow-hidden">
      {children}
    </div>
  );
}
