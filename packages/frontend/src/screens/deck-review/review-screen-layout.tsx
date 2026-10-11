import { ReactNode } from "preact/compat";

export function ReviewScreenLayout({
  header,
  children,
}: {
  header: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(var(--app-viewport-height)_-_var(--app-safe-area-top)_-_var(--app-route-bottom-inset)_-_var(--app-top-offset,12px))] flex-col">
      <div className="shrink-0">{header}</div>
      {children}
    </div>
  );
}
