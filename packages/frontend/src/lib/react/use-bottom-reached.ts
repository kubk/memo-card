import { useEffect, useRef } from "react";
import { getRouteScrollElement } from "./route-scroll-container.ts";

type Options = {
  offset?: number;
  enabled?: boolean;
};

export function useBottomReached(onReach: () => void, options: Options = {}) {
  const { offset = 300, enabled = true } = options;
  const onReachRef = useRef(onReach);

  useEffect(() => {
    onReachRef.current = onReach;
  }, [onReach]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let isScheduled = false;

    const check = () => {
      if (isScheduled) {
        return;
      }

      isScheduled = true;
      requestAnimationFrame(() => {
        isScheduled = false;
        const scrollEl = getRouteScrollElement();
        if (!scrollEl) {
          return;
        }
        const { scrollTop, clientHeight, scrollHeight } = scrollEl;
        if (scrollTop + clientHeight >= scrollHeight - offset) {
          onReachRef.current();
        }
      });
    };

    check();
    const scrollEl = getRouteScrollElement();

    scrollEl?.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    window.addEventListener("orientationchange", check);

    return () => {
      scrollEl?.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
      window.removeEventListener("orientationchange", check);
    };
  }, [enabled, offset]);
}
