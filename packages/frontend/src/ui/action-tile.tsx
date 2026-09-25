import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "./cn.ts";

export const actionTileClassName =
  "flex h-[72px] w-full min-w-0 flex-1 flex-col items-center justify-center gap-1.5 bg-bg px-1 text-xs text-button select-none transition-colors duration-200 ease-in-out active:bg-button-alpha-20";

export function ActionTileContent({
  icon,
  text,
}: {
  icon: ReactNode;
  text: string;
}) {
  return (
    <>
      {icon}
      <span className="max-w-full truncate">{text}</span>
    </>
  );
}

type Props = {
  icon: ReactNode;
  text: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function ActionTile({ icon, text, className, ...restProps }: Props) {
  return (
    <button
      {...restProps}
      className={cn(
        actionTileClassName,
        "disabled:text-disabled disabled:active:bg-bg",
        className,
      )}
    >
      <ActionTileContent icon={icon} text={text} />
    </button>
  );
}
