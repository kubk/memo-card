import { cn } from "./cn.ts";

type BadgeProps = {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "disabled";
  className?: string;
};

export function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full text-xs mt-0.5 font-bold min-w-[6px]",
        {
          "text-button-outline-fg-light dark:text-button-outline-fg-dark":
            variant === "default",
          "text-hint": variant === "secondary",
          "text-text": variant === "disabled",
        },
        className,
      )}
    >
      {children}
    </span>
  );
}
