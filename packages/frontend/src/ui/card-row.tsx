import { ReactNode } from "react";
import { cn } from "./cn";

export function CardRow({
  children,
  onClick,
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <label
      onClick={onClick}
      className={cn(
        "bg-bg rounded-xl h-12 box-border p-3 flex justify-between items-center cursor-pointer",
        className,
      )}
    >
      {children}
    </label>
  );
}
