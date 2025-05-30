import { ReactNode } from "react";
import { cn } from "./cn.ts";

type Props = {
  text: string;
  rightSlot?: ReactNode;
};

export function ListHeader(props: Props) {
  const { text, rightSlot } = props;

  return (
    <h5
      className={cn(
        "text-hint font-normal text-sm m-0 p-0 pl-3 pt-1 pb-0 mb-1 uppercase",
        rightSlot && "relative",
      )}
    >
      {text}
      {rightSlot}
    </h5>
  );
}
