import { css, cx } from "@emotion/css";
import React, { ReactNode, useMemo } from "react";
import { colord } from "colord";
import { reset } from "./reset.ts";
import { theme } from "./theme.tsx";

type Props = {
  mainColor?: string;
  outline?: boolean;
  noPseudoClasses?: boolean;
  icon?: string | ReactNode;
  column?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button(props: Props) {
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
          ":focus": {
            boxShadow: `0 0 0 0.2rem ${parsedColor.alpha(0.4).toHex()}`,
          },
          ":active": {
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
            backgroundColor: parsedColor.alpha(0.2).toHex(),
            color: mainColor,
            ":disabled": {
              backgroundColor: parsedColor.lighten(0.4).toHex(),
              cursor: "not-allowed",
            },
          }),
        className,
      )}
    >
      {icon ? (
        typeof icon === "string" ? (
          <span
            className={css({ color: "inherit", position: "relative", top: 1 })}
          >
            {icon}
          </span>
        ) : (
          icon
        )
      ) : null}
      {children}
    </button>
  );
}
