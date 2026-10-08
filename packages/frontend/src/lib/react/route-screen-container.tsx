import * as m from "motion/react-m";
import type { Transition } from "motion/react";
import { ReactNode, useLayoutEffect, useRef } from "preact/compat";
import { screenStore } from "../../store/screen-store.ts";
import { platform } from "../platform/platform.ts";
import { TelegramPlatform } from "../platform/telegram/telegram-platform.ts";
import { routeScrollContainerProps } from "./route-scroll-container.ts";
import { cn } from "../../ui/cn.ts";
import { Route } from "../../store/routing/route-types.ts";
import { routeScreenContainerClassName } from "./route-screen-container-class.ts";

type RouteScreenContainerProps = {
  children: ReactNode;
};

type NavigationDirection = "forward" | "back" | "replace";

function getRouteAnimation(
  screenType: Route["type"],
  navigationDirection: NavigationDirection,
): {
  initial: { opacity: number; x?: number; y?: number };
  animate: { opacity: number; x?: number; y?: number };
  transition: Transition;
} {
  if (screenType === "globalSearch") {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.14, ease: "easeOut" },
    };
  }

  const x =
    navigationDirection === "forward"
      ? 18
      : navigationDirection === "back"
        ? -18
        : 0;

  return {
    initial: {
      opacity: 0,
      x,
      y: navigationDirection === "replace" ? 8 : 0,
    },
    animate: { opacity: 1, x: 0, y: 0 },
    transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] },
  };
}

export function RouteScreenContainer(props: RouteScreenContainerProps) {
  const { children } = props;
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const screenEntryId = screenStore.screenEntryId;
  const screenType = screenStore.screen.type;
  const navigationDirection = screenStore.screenNavigationDirection;
  const animation = getRouteAnimation(screenType, navigationDirection);
  const shouldAnimate = screenStore.screenTransition === "animated";

  useLayoutEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) {
      return;
    }

    const scrollTop = screenStore.currentScrollTop;
    scrollContainer.scrollTop = scrollTop;

    const frame = window.requestAnimationFrame(() => {
      scrollContainer.scrollTop = scrollTop;
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [screenEntryId]);

  return (
    <m.div
      key={screenEntryId}
      ref={scrollContainerRef}
      {...routeScrollContainerProps}
      className={cn(
        routeScreenContainerClassName,
        platform instanceof TelegramPlatform && platform.isWeb() && "mt-4",
        screenType === "browserLogin" &&
          "flex min-h-[calc(100vh_-_48px)] items-center justify-center",
      )}
      initial={shouldAnimate ? animation.initial : false}
      animate={animation.animate}
      transition={animation.transition}
      onScroll={(event) => {
        screenStore.setCurrentScrollTop(event.currentTarget.scrollTop);
      }}
    >
      {children}
    </m.div>
  );
}
