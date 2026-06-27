import { motion } from "framer-motion";
import { ReactNode, useLayoutEffect, useRef } from "react";
import { screenStore } from "../../store/screen-store.ts";
import { platform } from "../platform/platform.ts";
import { TelegramPlatform } from "../platform/telegram/telegram-platform.ts";
import { routeScrollContainerProps } from "./route-scroll-container.ts";
import { cn } from "../../ui/cn.ts";
import { Route } from "../../store/routing/route-types.ts";

type RouteScreenContainerProps = {
  children: ReactNode;
};

type NavigationDirection = "forward" | "back" | "replace";

function getRouteAnimation(
  screenType: Route["type"],
  navigationDirection: NavigationDirection,
) {
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
    <motion.div
      key={screenEntryId}
      ref={scrollContainerRef}
      {...routeScrollContainerProps}
      className={cn(
        "absolute inset-0 box-border overflow-y-auto overscroll-contain pb-[var(--tg-safe-area-inset-bottom,0px)] pl-[calc(var(--tg-safe-area-inset-left,0px)_+_var(--app-horizontal-padding))] pr-[calc(var(--tg-safe-area-inset-right,0px)_+_var(--app-horizontal-padding))] pt-[calc(var(--tg-safe-area-inset-top,0px)_+_var(--app-top-offset,12px))]",
        platform instanceof TelegramPlatform && platform.isWeb() && "mt-4",
        screenType === "browserLogin" &&
          "flex min-h-[calc(100vh_-_48px)] items-center justify-center",
      )}
      initial={animation.initial}
      animate={animation.animate}
      transition={animation.transition}
      onScroll={(event) => {
        screenStore.setCurrentScrollTop(event.currentTarget.scrollTop);
      }}
    >
      {children}
    </motion.div>
  );
}
