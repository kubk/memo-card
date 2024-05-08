import React, { ReactNode, useEffect, useRef } from "react";
import { css } from "@emotion/css";
import { throttle } from "../../throttle/throttle.ts";
import { platform } from "../platform.ts";
import { TelegramPlatform } from "./telegram-platform.ts";
import WebApp from "@twa-dev/sdk";

type Props = {
  condition: boolean;
  children: ReactNode;
};

export const PreventTelegramSwipeDownClosing = (props: Props) => {
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
      className={css({
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: "hidden",
      })}
    >
      <div
        ref={ref}
        className={css({
          height: "100%",
          overflowY: "scroll",
          transform: "translate3d(0, 0, 0)",
          WebkitOverflowScrolling: "touch",
          padding: "0 16px 0 16px",
        })}
      >
        {children}
      </div>
    </div>
  );
};

export const PreventTelegramSwipeDownClosingIos = (props: {
  children: ReactNode;
}) => {
  const isEnabled = platform instanceof TelegramPlatform && platform.isIos();
  return (
    <PreventTelegramSwipeDownClosing condition={isEnabled}>
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
      WebApp.expand();
    };
    WebApp.onEvent("viewportChanged", onViewPortChanged);

    return () => {
      WebApp.offEvent("viewportChanged", onViewPortChanged);
    };
  }, []);
};
