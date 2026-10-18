import { lazy, Suspense, useRef, useState } from "preact/compat";

const TAP_COUNT = 10;
const TAP_RESET_MS = 2000;

const DevMenu = lazy(() =>
  import("./dev-menu.tsx").then((module) => ({
    default: module.DevMenu,
  })),
);

export function useDevMenuReveal() {
  const tapCountRef = useRef(0);
  const tapResetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  function handleMainTap() {
    if (tapResetTimerRef.current) {
      clearTimeout(tapResetTimerRef.current);
    }

    tapCountRef.current++;

    if (tapCountRef.current >= TAP_COUNT) {
      tapCountRef.current = 0;
      setIsOpen(true);
      return;
    }

    tapResetTimerRef.current = setTimeout(() => {
      tapCountRef.current = 0;
    }, TAP_RESET_MS);
  }

  const devMenu = isOpen ? (
    <Suspense fallback={null}>
      <DevMenu onOpenChange={setIsOpen} />
    </Suspense>
  ) : null;

  return { handleMainTap, devMenu };
}
