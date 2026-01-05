import { ReactNode, useEffect, useRef } from "react";
import { throttle } from "../../throttle/throttle.ts";
import { platform } from "../platform.ts";
import { TelegramPlatform } from "./telegram-platform.ts";
import { getWebApp } from "./telegram-web-app.ts";

type Props = {
  condition: boolean;
  children: ReactNode;
};

const PreventTelegramSwipeDownClosing = (props: Props) => {
  const { condition, children } = props;
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!condition) {
      return;
    }
    const scrollableElement = ref.current;
    if (!scrollableElement) {
      return;
    }

    const onTouchMove = throttle((e: MouseEvent) => {
      const withScroll = (ref.current?.scrollHeight || 0) > window.innerHeight;

      if (withScroll) {
        requestAnimationFrame(() => {
          e.preventDefault();
        });
      } else {
        e.preventDefault();
      }
    }, 100);

    scrollableElement.addEventListener("touchmove", onTouchMove, false);

    return () => {
      scrollableElement.removeEventListener("touchmove", onTouchMove, false);
    };
    // eslint-disable-next-line
  }, []);

  if (!condition) {
    return children;
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: "hidden",
      }}
    >
      <div
        ref={ref}
        style={{
          height: "100%",
          overflowY: "scroll",
          transform: "translate3d(0, 0, 0)",
          WebkitOverflowScrolling: "touch",
          padding: "0 16px 0 16px",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const PreventTelegramSwipeDownClosingIos = (props: {
  children: ReactNode;
}) => {
  const isOldIos =
    platform instanceof TelegramPlatform &&
    platform.isIos() &&
    !platform.isSwipeControllable();
  return (
    <PreventTelegramSwipeDownClosing condition={isOldIos}>
      {props.children}
    </PreventTelegramSwipeDownClosing>
  );
};

// A hacky way to force expand app back whenever user pull app down
export const useRestoreFullScreenExpand = () => {
  useEffect(() => {
    if (!(platform instanceof TelegramPlatform)) {
      return;
    }

    if (!platform.isIos() && !platform.isAndroid()) {
      return;
    }

    const onViewPortChanged = () => {
      getWebApp().expand();
    };
    getWebApp().onEvent("viewportChanged", onViewPortChanged);

    return () => {
      getWebApp().offEvent("viewportChanged", onViewPortChanged);
    };
  }, []);
};
