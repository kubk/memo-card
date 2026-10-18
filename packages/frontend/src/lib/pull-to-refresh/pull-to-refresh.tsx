import { type ReactNode, useEffect, useRef } from "preact/compat";
import { range } from "../array/range.ts";
import { cn } from "../../ui/cn.ts";
import { type PullToRefreshStore } from "./pull-to-refresh-store.ts";

const spinnerSize = 28;
const tickCount = 12;
const releaseTransition =
  "transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.2,0.9,0.3,1)]";

type Gesture = {
  startX: number;
  startY: number;
  isPulling: boolean;
};

function isInsideScrolledElement(target: EventTarget | null, root: Element) {
  let element = target instanceof Element ? target : null;

  while (element && element !== root) {
    if (element.scrollTop > 0) {
      return true;
    }
    element = element.parentElement;
  }

  return false;
}

function usePullGesture(
  store: PullToRefreshStore,
  ref: { current: HTMLElement | null },
) {
  useEffect(() => {
    const root = ref.current;
    if (!root) {
      return;
    }

    let gesture: Gesture | null = null;

    const cancel = () => {
      if (gesture?.isPulling) {
        store.cancelPull();
      }
      gesture = null;
    };

    const onTouchStart = (event: TouchEvent) => {
      gesture = null;

      const touch = event.touches[0];
      if (
        !touch ||
        event.touches.length !== 1 ||
        !store.isAvailable ||
        store.isRefreshing ||
        isInsideScrolledElement(event.target, root)
      ) {
        return;
      }

      gesture = {
        startX: touch.clientX,
        startY: touch.clientY,
        isPulling: false,
      };
    };

    const onTouchMove = (event: TouchEvent) => {
      if (!gesture) {
        return;
      }

      const touch = event.touches[0];
      if (!touch || event.touches.length !== 1) {
        cancel();
        return;
      }

      const deltaX = touch.clientX - gesture.startX;
      const deltaY = touch.clientY - gesture.startY;

      // Browsers ignore preventDefault once native scrolling starts, so the
      // first move decides who owns the gesture
      if (!gesture.isPulling) {
        if (deltaX === 0 && deltaY === 0) {
          return;
        }

        if (deltaY <= 0 || Math.abs(deltaX) > deltaY) {
          gesture = null;
          return;
        }

        gesture.isPulling = true;
        store.startPull();
      }

      if (event.cancelable) {
        event.preventDefault();
      }
      store.movePull(deltaY);
    };

    const onTouchEnd = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        return;
      }

      if (gesture?.isPulling) {
        store.endPull();
      }
      gesture = null;
    };

    root.addEventListener("touchstart", onTouchStart, { passive: true });
    root.addEventListener("touchmove", onTouchMove, { passive: false });
    root.addEventListener("touchend", onTouchEnd, { passive: true });
    root.addEventListener("touchcancel", cancel, { passive: true });

    return () => {
      cancel();
      root.removeEventListener("touchstart", onTouchStart);
      root.removeEventListener("touchmove", onTouchMove);
      root.removeEventListener("touchend", onTouchEnd);
      root.removeEventListener("touchcancel", cancel);
    };
  }, [store, ref]);
}

function getTickOpacity(
  store: PullToRefreshStore,
  index: number,
  visibleTicks: number,
) {
  if (store.isRefreshing) {
    const stepsBehindHead = (tickCount - index) % tickCount;
    return 1 - stepsBehindHead * 0.06;
  }

  return index < visibleTicks ? 1 : 0;
}

function Spinner({ store }: { store: PullToRefreshStore }) {
  const offset = store.contentOffset;
  const visibleTicks = Math.floor(store.progress * tickCount);

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-x-0 top-[var(--app-safe-area-top)] flex justify-center text-hint",
        !store.isPulling && releaseTransition,
      )}
      style={{
        opacity: offset > 0 ? 1 : 0,
        transform: `translateY(${Math.max(0, (offset - spinnerSize) / 2)}px)`,
      }}
    >
      <svg
        width={spinnerSize}
        height={spinnerSize}
        viewBox="0 0 28 28"
        className={cn(store.isRefreshing && "animate-spin")}
        style={{ animationTimingFunction: `steps(${tickCount}, end)` }}
      >
        {range(tickCount).map((index) => (
          <rect
            key={index}
            x={12.75}
            y={2.5}
            width={2.5}
            height={7}
            rx={1.25}
            fill="currentColor"
            transform={`rotate(${(index * 360) / tickCount} 14 14)`}
            className={cn(
              !store.isPulling && "transition-opacity duration-300 ease-out",
            )}
            style={{ opacity: getTickOpacity(store, index, visibleTicks) }}
          />
        ))}
      </svg>
    </div>
  );
}

export function PullToRefresh({
  store,
  children,
}: {
  store: PullToRefreshStore;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const offset = store.contentOffset;

  usePullGesture(store, ref);

  return (
    <>
      <Spinner store={store} />
      <div
        ref={ref}
        className={cn(
          "absolute inset-0",
          !store.isPulling && releaseTransition,
        )}
        style={{
          transform: offset > 0 ? `translateY(${offset}px)` : undefined,
        }}
      >
        {children}
      </div>
    </>
  );
}
