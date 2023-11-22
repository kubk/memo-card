// @ts-nocheck
import React, { ReactNode, useEffect } from "react";

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

  useEffect(() => {
    if (!condition) {
      return;
    }
    const scrollableElement = document.querySelector(".scrollable-content");

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
      scrollableElement.removeEventListener("touchMove", onTouchMove, false);
    };
    // eslint-disable-next-line
  }, []);

  if (!condition) {
    return children;
  }

  return (
    <div className="fixed-container">
      <div className="scrollable-content">{children}</div>
    </div>
  );
};

const isMobileIos = /iPad|iPhone|iPod/.test(navigator.userAgent);

export const PreventTelegramSwipeDownClosingIos = (props: {
  children: ReactNode;
  withScroll: boolean;
}) => {
  return (
    <PreventTelegramSwipeDownClosing
      condition={isMobileIos}
      withScroll={props.withScroll}
    >
      {props.children}
    </PreventTelegramSwipeDownClosing>
  );
};
