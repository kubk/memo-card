import { css, cx } from "@emotion/css";
import React, { useMemo } from "react";
import { colord } from "colord";
import { reset } from "./reset.ts";
import { theme } from "./theme.tsx";
import { isDarkTheme } from "../lib/color-scheme/is-dark-theme.tsx";

type Props = {
  mainColor?: string;
  outline?: boolean;
  noPseudoClasses?: boolean;
  icon?: string;
  column?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = (props: Props) => {
  const {
    className,
    mainColor = theme.buttonColorComputed,
    outline,
    children,
    icon,
    noPseudoClasses,
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
          flexDirection: column ? 'column' : undefined,
          width: "100%",
          gap: column ? 0 : 8,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: mainColor,
          cursor: "pointer",
          ":hover": noPseudoClasses
            ? undefined
            : {
                backgroundColor: parsedColor.darken(0.1).toHex(),
              },
          ":focus": noPseudoClasses
            ? undefined
            : {
                boxShadow: `0 0 0 0.2rem ${parsedColor.alpha(0.4).toHex()}`,
              },
          ":active": noPseudoClasses
            ? undefined
            : {
                backgroundColor: parsedColor.darken(0.1).toHex(),
                transform: "scale(0.97)",
              },
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
          transitionTimingFunction: "ease-in-out",
          transitionProperty: "background-color, border, box-shadow, color",
        }),
        outline &&
          css({
            backgroundColor: parsedColor
              .lighten(isDarkTheme() ? 0.35 : 0.4)
              .toHex(),
            color: mainColor,
            ":hover": noPseudoClasses
              ? undefined
              : {
                  backgroundColor: parsedColor
                    .lighten(0.4)
                    .darken(0.08)
                    .toHex(),
                },
          }),
        className,
      )}
    >
      {icon && (
        <i
          className={cx(
            "mdi",
            icon,
            css({ color: "inherit", position: "relative", top: 1 }),
          )}
        />
      )}
      {children}
    </button>
  );
};
