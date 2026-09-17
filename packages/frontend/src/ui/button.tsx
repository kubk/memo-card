import {
  type ButtonHTMLAttributes,
  type CSSProperties,
  type ReactNode,
  useMemo,
} from "react";
import { colord } from "colord";
import { reset } from "./reset.ts";
import { theme } from "./theme.tsx";
import { cn } from "./cn.ts";

export type ButtonVariant = "main" | "danger";

type Props = {
  variant?: ButtonVariant;
  outline?: boolean;
  noPseudoClasses?: boolean;
  icon?: string | ReactNode;
  column?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

type ButtonStyle = CSSProperties & {
  "--button-bg": string;
  "--button-color": string;
  "--button-focus-shadow": string;
  "--button-active-bg": string;
};

export function Button(props: Props) {
  const {
    className,
    variant = "main",
    outline,
    noPseudoClasses,
    children,
    icon,
    column,
    style,
    ...restProps
  } = props;

  const mainColor =
    variant === "danger" ? theme.danger : theme.buttonColorComputed;
  const parsedColor = useMemo(() => colord(mainColor), [mainColor]);
  const buttonStyle: ButtonStyle = {
    "--button-bg": outline ? parsedColor.alpha(0.2).toHex() : mainColor,
    "--button-color": outline ? mainColor : theme.buttonTextColorComputed,
    "--button-focus-shadow": parsedColor.alpha(0.4).toHex(),
    "--button-active-bg": parsedColor.darken(0.1).toHex(),
    ...style,
  };

  return (
    <button
      {...restProps}
      style={buttonStyle}
      className={cn(
        reset.button,
        "flex h-[45px] w-full items-center justify-center rounded-xl bg-[var(--button-bg)] px-3 py-3 text-sm font-semibold leading-[1.5] text-[var(--button-color)] select-none transition-[background-color,border,box-shadow,color] duration-200 ease-in-out",
        column ? "flex-col gap-0" : "gap-2",
        !noPseudoClasses &&
          "focus:shadow-[0_0_0_0.2rem_var(--button-focus-shadow)] active:scale-[0.97] active:bg-[var(--button-active-bg)] disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100",
        className,
      )}
    >
      {icon ? (
        typeof icon === "string" ? (
          <span className="relative top-px text-inherit">{icon}</span>
        ) : (
          icon
        )
      ) : null}
      {children}
    </button>
  );
}
