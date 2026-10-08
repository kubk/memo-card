import { Loader2 } from "lucide-react";
import { cn } from "./cn.ts";

type Props = {
  height?: string;
  variant?: "bg" | "secondary-bg";
};

export function FullScreenLoader({
  height = "var(--app-viewport-height)",
  variant = "secondary-bg",
}: Props) {
  return (
    <div
      className={cn(
        "flex items-center justify-center",
        variant === "bg" ? "bg-bg" : "bg-secondary-bg",
      )}
      style={{ height }}
    >
      <Loader2 size={48} className="animate-spin" />
    </div>
  );
}
