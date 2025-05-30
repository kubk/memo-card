import { ReactNode } from "react";
import { cn } from "./cn";

type Props = {
  children: ReactNode;
  isSelected?: boolean;
  onClick: () => void;
  fullWidth?: boolean;
};

export function Chip(props: Props) {
  const { children, isSelected, onClick, fullWidth } = props;
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center justify-center px-3 py-2 rounded-[10px] bg-bg shadow text-sm font-medium cursor-pointer text-text",
        isSelected && "bg-button text-button-text",
        fullWidth && "w-full",
      )}
    >
      {children}
    </div>
  );
}
