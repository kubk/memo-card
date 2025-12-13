import { css, cx } from "@emotion/css";
import React, { ReactNode, useMemo } from "react";
import { colord } from "colord";
import { reset } from "./reset.ts";
import { theme } from "./theme.tsx";
import { userStore } from "../store/user-store.ts";
import { screenStore } from "../store/screen-store.ts";
import { StarIcon } from "lucide-react";

type Props = {
  mainColor?: string;
  outline?: boolean;
  icon: ReactNode;
  column?: boolean;
  align?: "left" | "center";
  isPro?: boolean;
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
    isPro,
    onClick,
    ...restProps
  } = props;
  const showProBadge = isPro && !userStore.isPaid;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isPro && !userStore.isPaid) {
      screenStore.go({ type: "plans" });
      return;
    }
    onClick?.(e);
  };

  const parsedColor = useMemo(() => colord(mainColor), [mainColor]);

  return (
    <button
      {...restProps}
      onClick={handleClick}
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
      {showProBadge && (
        <span
          className={css({
            position: "absolute",
            top: -6,
            right: userStore.isRtl ? undefined : -6,
            left: userStore.isRtl ? -6 : undefined,
            width: 20,
            height: 20,
            borderRadius: "50%",
            backgroundImage:
              "linear-gradient(to right, #8b5cf6, #ec4899, #ef4444)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          })}
        >
          <StarIcon size={12} fill="white" color="white" />
        </span>
      )}
    </button>
  );
}
