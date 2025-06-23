import { css, cx } from "@emotion/css";
import React, { ReactNode, useMemo } from "react";
import { colord } from "colord";
import { reset } from "./reset.ts";
import { theme } from "./theme.tsx";
import { userStore } from "../store/user-store.ts";

type Props = {
  mainColor?: string;
  outline?: boolean;
  icon: ReactNode;
  column?: boolean;
  align?: "left" | "center";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function ButtonSideAligned(props: Props) {
  const align = props.align || "left";
  const {
    className,
    mainColor = theme.buttonColorComputed,
    outline,
    children,
    icon,
    column,
    ...restProps
  } = props;

  const parsedColor = useMemo(() => colord(mainColor), [mainColor]);

  return (
    <button
      {...restProps}
      className={cx(
        reset.button,
        css({
          display: "flex",
          flexDirection: column ? "column" : undefined,
          width: "100%",
          gap: column ? 0 : 8,
          height: 45,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: mainColor,
          cursor: "pointer",
          ":disabled": {
            opacity: 0.4,
            cursor: "not-allowed",
          },
          color: theme.buttonTextColorComputed,
          fontWeight: 600,
          fontSize: 14,
          lineHeight: 1.5,
          padding: "0.75rem 0.75rem",
          userSelect: "none",
          transitionDuration: "0.2s",
          borderRadius: theme.borderRadius,
          position: "relative",
          transitionTimingFunction: "ease-in-out",
          transitionProperty: "background-color, border, box-shadow, color",
          ":active:not(:disabled)": {
            transform: "scale(0.97)",
          },
        }),
        outline &&
          css({
            backgroundColor: parsedColor.alpha(0.2).toHex(),
            color: mainColor,
          }),
        className,
      )}
    >
      <span
        className={css(
          {
            position: "absolute",
            left: userStore.isRtl ? undefined : 16,
            right: userStore.isRtl && align !== "center" ? 16 : undefined,
            display: "flex",
            alignItems: "center",
            gap: 8,
          },
          align === "center" && {
            left: "50%",
            transform: "translate(-50%)",
          },
        )}
      >
        {icon ? icon : null}
        {children}
      </span>
    </button>
  );
}
