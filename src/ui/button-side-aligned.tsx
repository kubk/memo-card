import { css, cx } from "@emotion/css";
import React, { useMemo } from "react";
import { colord } from "colord";
import { reset } from "./reset.ts";
import { theme } from "./theme.tsx";
import { isDarkTheme } from "../lib/color-scheme/is-dark-theme.tsx";

type Props = {
  mainColor?: string;
  outline?: boolean;
  icon: string;
  column?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const ButtonSideAligned = (props: Props) => {
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
            backgroundColor: parsedColor.lighten(0.15).toHex(),
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
        }),
        outline &&
          css({
            backgroundColor: parsedColor
              .lighten(isDarkTheme() ? 0.35 : 0.4)
              .toHex(),
            color: mainColor,
          }),
        className,
      )}
    >
      <span
        className={css({
          position: "absolute",
          left: 16,
          display: "flex",
          alignItems: "center",
          gap: 8,
        })}
      >
        {icon && <i className={cx("mdi", icon, css({ color: "inherit" }))} />}
        {children}
      </span>
    </button>
  );
};
