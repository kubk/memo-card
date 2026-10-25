import { type CSSProperties } from "preact/compat";
import { range } from "../lib/array/range.ts";
import { cn } from "./cn.ts";
import "./activity-indicator.css";

export const activityIndicatorTickCount = 12;

export function ActivityIndicatorTick({
  index,
  className,
  style,
}: {
  index: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <rect
      x={12.75}
      y={2.5}
      width={2.5}
      height={7}
      rx={1.25}
      fill="currentColor"
      transform={`rotate(${(index * 360) / activityIndicatorTickCount} 14 14)`}
      className={className}
      style={style}
    />
  );
}

// Only the ticks fade, a rotating svg jitters in Safari
export function ActivityIndicator({ className }: { className?: string }) {
  return (
    <svg
      width={48}
      height={48}
      viewBox="0 0 28 28"
      className={cn("text-hint", className)}
    >
      {range(activityIndicatorTickCount).map((index) => (
        <ActivityIndicatorTick
          key={index}
          index={index}
          style={{
            animation: `activity-indicator-fade 1s linear ${index / activityIndicatorTickCount - 1}s infinite`,
          }}
        />
      ))}
    </svg>
  );
}
