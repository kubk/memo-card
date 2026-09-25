import { type ButtonHTMLAttributes } from "react";
import { reset } from "./reset.ts";
import { cn } from "./cn.ts";

export function TextButton({
  className,
  children,
  onClick,
  type,
}: Pick<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "className" | "onClick" | "type"
>) {
  return (
    <button
      onClick={onClick}
      type={type}
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
