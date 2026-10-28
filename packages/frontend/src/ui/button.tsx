import { type ButtonHTMLAttributes, type ReactNode } from "preact/compat";
import { reset } from "./reset.ts";
import { cn } from "./cn.ts";

type ButtonVariant = "main" | "outline" | "danger";

const variantClassNames: Record<ButtonVariant, string> = {
  main: "bg-button text-button-text focus:shadow-button-focus active:bg-button-darkened",
  outline: "bg-button-alpha-20 text-button focus:shadow-button-focus",
  danger:
    "bg-danger text-button-text focus:shadow-danger-focus active:bg-danger-darkened",
};

export function Button({
  className,
  variant = "main",
  large,
  icon,
  children,
  ...restProps
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  large?: boolean;
  icon?: ReactNode;
}) {
  return (
    <button
      {...restProps}
      className={cn(
        reset.button,
        "flex w-full items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold leading-[1.5] select-none transition-[background-color,border,box-shadow,color] duration-200 ease-in-out active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100",
        large ? "h-[53px]" : "h-[45px]",
        variantClassNames[variant],
        className,
      )}
    >
      {icon}
      {children}
    </button>
  );
}
