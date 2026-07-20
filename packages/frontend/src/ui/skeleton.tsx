import { type CSSProperties } from "react";
import { cn } from "./cn.ts";
import "./skeleton.css";

type Props = {
  className?: string;
  duration?: number;
};

export function Skeleton(props: Props) {
  const style = props.duration
    ? ({ "--skeleton-duration": `${props.duration}s` } as CSSProperties)
    : undefined;

  return (
    <span
      className={cn("skeleton-wave block", props.className)}
      style={style}
    />
  );
}
