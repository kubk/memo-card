import { type ButtonHTMLAttributes } from "preact/compat";
import { cn } from "./cn.ts";
import { reset } from "./reset.ts";

export function ButtonLink({
  variant = "underline",
  className,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "underline" | "dotted" | "plain";
}) {
  return (
    <button
      {...props}
      type={type}
      className={cn(
        reset.button,
        "inline whitespace-nowrap text-[length:inherit] text-link",
        variant !== "plain" && "underline",
        variant === "dotted" && "decoration-dotted underline-offset-4",
        className,
      )}
    />
  );
}
