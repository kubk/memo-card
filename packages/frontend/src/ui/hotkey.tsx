import { userStore } from "../store/user-store";
import { cn } from "./cn";

type Props = {
  shortcut: string;
  className?: string;
};

export function Hotkey({ shortcut, className }: Props) {
  return (
    <span
      className={cn(
        "absolute top-1 hidden md:flex h-5 w-5 items-center justify-center rounded-md text-xs font-semibold",
        className,
        userStore.isRtl ? "left-1" : "right-1",
      )}
    >
      {shortcut}
    </span>
  );
}
