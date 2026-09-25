import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { reset } from "./reset.ts";
import { userStore } from "../store/user-store.ts";
import { cn } from "./cn.ts";

type ButtonVariant = "main" | "danger" | "secondary";
type ButtonAlignment = "left" | "center";

type CommonProps = {
  noPseudoClasses?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

type CenteredButtonProps = {
  variant?: ButtonVariant;
  outline?: boolean;
  icon?: string | ReactNode;
  column?: boolean;
  align?: never;
};

type SideAlignedButtonProps = {
  align: ButtonAlignment;
  icon: ReactNode;
  variant?: never;
  outline?: never;
  column?: never;
};

type Props = CommonProps & (CenteredButtonProps | SideAlignedButtonProps);

type ButtonColorClasses = {
  base: string;
  focus: string;
  active: string;
};

function getButtonColorClasses(
  variant: ButtonVariant,
  outline: boolean,
): ButtonColorClasses {
  if (variant === "secondary") {
    return {
      base: "bg-secondary-bg text-text",
      focus: "focus:shadow-hint-focus",
      active: "active:bg-bg",
    };
  }
  if (variant === "danger") {
    return {
      base: outline
        ? "bg-danger-alpha-20 text-danger"
        : "bg-danger text-button-text",
      focus: "focus:shadow-danger-focus",
      active: "active:bg-danger-darkened",
    };
  }
  return {
    base: outline
      ? "bg-button-alpha-20 text-button"
      : "bg-button text-button-text",
    focus: "focus:shadow-button-focus",
    active: "active:bg-button-darkened",
  };
}

export function Button(props: Props) {
  const {
    className,
    variant = "main",
    outline,
    noPseudoClasses,
    children,
    icon,
    column,
    align,
    style,
    ...restProps
  } = props;

  const isSideAligned = align !== undefined;
  const colorClasses = isSideAligned
    ? { base: "bg-button-alpha-20 text-button", focus: "", active: "" }
    : getButtonColorClasses(variant, outline ?? false);

  return (
    <button
      {...restProps}
      style={style}
      className={cn(
        reset.button,
        isSideAligned
          ? "relative flex h-[45px] w-full items-center justify-center rounded-xl px-3 py-3 text-sm font-semibold leading-[1.5] select-none transition-[background-color,border,box-shadow,color] duration-200 ease-in-out active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100"
          : "flex h-[45px] w-full items-center justify-center rounded-xl px-3 py-3 text-sm font-semibold leading-[1.5] select-none transition-[background-color,border,box-shadow,color] duration-200 ease-in-out",
        colorClasses.base,
        isSideAligned ? "gap-2" : column ? "flex-col gap-0" : "gap-2",
        !noPseudoClasses &&
          !isSideAligned &&
          cn(
            colorClasses.focus,
            "active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100",
            !outline && colorClasses.active,
          ),
        className,
      )}
    >
      {isSideAligned ? (
        <span
          className={cn(
            "absolute flex items-center gap-2",
            align === "center"
              ? "left-1/2 -translate-x-1/2"
              : userStore.isRtl
                ? "right-4"
                : "left-4",
          )}
        >
          {icon ? icon : null}
          {children}
        </span>
      ) : null}
      {!isSideAligned ? (
        <>
          {icon ? (
            typeof icon === "string" ? (
              <span className="relative top-px text-inherit">{icon}</span>
            ) : (
              icon
            )
          ) : null}
          {children}
        </>
      ) : null}
    </button>
  );
}
