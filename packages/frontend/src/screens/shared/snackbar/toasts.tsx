import { useEffect, useRef } from "preact/compat";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { Loader2Icon } from "lucide-react";
import { type Toast, type ToastVariant, toastStore } from "./toast-store.ts";

const enterTransition = { duration: 0.225, ease: [0, 0, 0.2, 1] } as const;

const exitTransition = {
  opacity: { duration: 0.15, ease: [0.25, 0.1, 0.25, 1] },
  height: { delay: 0.15, duration: 0.175, ease: [0.4, 0, 0.2, 1] },
} as const;

export function Toasts() {
  const containerRef = useRef<HTMLDivElement>(null);
  const enterOffset = containerRef.current?.offsetHeight ?? 0;

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-x-0 top-0 z-[1700] flex flex-col items-center pt-[var(--app-top-control-offset)]"
    >
      <AnimatePresence>
        {toastStore.toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} enterOffset={enterOffset} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({
  toast,
  enterOffset,
}: {
  toast: Toast;
  enterOffset: number;
}) {
  const timerRef = useRef<number | undefined>(undefined);

  const clearTimer = () => {
    window.clearTimeout(timerRef.current);
    timerRef.current = undefined;
  };

  const startTimer = () => {
    clearTimer();
    timerRef.current = window.setTimeout(
      () => toastStore.close(toast.id),
      toast.duration,
    );
  };

  useEffect(() => {
    startTimer();
    return clearTimer;
  }, []);

  return (
    <m.div
      className="w-[22rem] max-w-full"
      initial={{ y: `calc(-100% - ${enterOffset}px)` }}
      animate={{ y: 0, transition: enterTransition }}
      exit={{ opacity: 0, height: 0, transition: exitTransition }}
    >
      <div className="pb-1">
        <div
          className="pointer-events-auto mx-2 flex items-center rounded-2xl bg-[#202020cc] p-[0.9375rem] text-white backdrop-blur-[0.5rem] dark:bg-[#000000cc]"
          onClick={() => toastStore.close(toast.id)}
          onMouseEnter={clearTimer}
          onMouseLeave={startTimer}
        >
          <ToastIcon variant={toast.variant} />
          <div className="grow text-[0.9375rem] leading-[1.25] [overflow-wrap:anywhere]">
            {toast.title && <div className="font-medium">{toast.title}</div>}
            {toast.message}
          </div>
        </div>
      </div>
    </m.div>
  );
}

function ToastIcon({ variant }: { variant: ToastVariant }) {
  if (variant === "loading") {
    return <Loader2Icon size={28} className="me-3 shrink-0 animate-spin" />;
  }

  return (
    <svg className="me-3 size-7 shrink-0 fill-current" viewBox="0 0 32 32">
      {variant === "error" ? (
        <path d="M31 25.4 18.5 3.7c-1.1-1.9-3.8-1.9-4.9 0L1 25.4c-1.1 1.9.3 4.3 2.5 4.3h25.1c2.2 0 3.5-2.4 2.4-4.3m-15 .2c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2m2-7c0 1.2-1.1 2.2-2.3 2-1-.1-1.7-1.1-1.7-2.1v-3.7c0-1 .7-2 1.7-2.1 1.2-.2 2.3.8 2.3 2z" />
      ) : (
        <path d="M16 2.667c7.364 0 13.333 5.97 13.333 13.333S23.363 29.333 16 29.333 2.667 23.363 2.667 16 8.637 2.667 16 2.667m-1.333 10c-.737 0-1.334.597-1.334 1.333s.597 1.333 1.334 1.333v6H14c-.736 0-1.333.597-1.333 1.334 0 .736.597 1.333 1.333 1.333h4c.736 0 1.333-.597 1.333-1.333 0-.737-.597-1.334-1.333-1.334h-.667V14c0-.736-.597-1.333-1.333-1.333zm1-5c-.92 0-1.667.746-1.667 1.666S14.746 11 15.667 11c.92 0 1.666-.746 1.666-1.667 0-.92-.746-1.666-1.666-1.666" />
      )}
    </svg>
  );
}
