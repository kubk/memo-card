// @ts-nocheck
import React, { ReactNode, useEffect, useRef } from "react";
import WebApp from "@twa-dev/sdk";
import { css } from "@emotion/css";

function throttle(func, limit) {
  let inThrottle;
  return function () {
    // eslint-disable-next-line
    const args = arguments;
    // eslint-disable-next-line
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

type Props = {
  condition: boolean;
  children: ReactNode;
  withScroll: boolean;
};

export const PreventTelegramSwipeDownClosing = (props: Props) => {
  const { condition, children, withScroll } = props;
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!condition) {
      return;
    }
    const scrollableElement = ref.current;

    const onTouchMove = throttle((e) => {
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
  withScroll: boolean;
}) => {
  return (
    <PreventTelegramSwipeDownClosing
      condition={WebApp.platform === "ios"}
      withScroll={props.withScroll}
    >
      {props.children}
    </PreventTelegramSwipeDownClosing>
  );
};
