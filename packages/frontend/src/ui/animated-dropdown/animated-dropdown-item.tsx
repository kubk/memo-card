import { ReactNode } from "react";
import { cn } from "../cn";

export function AnimatedDropdownItem({
  onClick,
  children,
  className,
}: {
  onClick: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full bg-bg whitespace-nowrap text-left text-base px-4 py-3 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 flex items-center justify-between gap-3",
        className,
      )}
    >
      {children}
    </button>
  );
}
