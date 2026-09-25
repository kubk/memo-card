import { type ButtonHTMLAttributes } from "react";
import { reset } from "./reset.ts";
import { cn } from "./cn.ts";

export function TextButton({
  className,
  children,
  ...restProps
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...restProps}
      className={cn(
        reset.button,
        "text-[17px] font-medium text-link",
        className,
      )}
    >
      {children}
    </button>
  );
}
