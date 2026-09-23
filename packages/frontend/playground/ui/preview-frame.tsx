import { type ReactNode } from "react";

export function PreviewFrame({ children }: { children: ReactNode }) {
  return (
    <div className="grid w-full max-w-[320px] place-items-center text-[var(--tg-theme-text-color)]">
      {children}
    </div>
  );
}
