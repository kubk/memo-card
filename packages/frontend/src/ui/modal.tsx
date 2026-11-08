import { type ReactNode } from "preact/compat";
import { useOverlay } from "../lib/react/use-overlay.ts";

export function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  useOverlay();

  return (
    <div
      className="fixed inset-0 z-confirm-alert grid place-items-center bg-black/50 safe-viewport-padding"
      onClick={onClose}
    >
      <div
        className="flex w-full max-w-106.25 flex-col gap-5 rounded-2xl bg-bg p-5 text-text text-pretty shadow"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="m-0 text-center text-xl font-semibold leading-snug">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}
