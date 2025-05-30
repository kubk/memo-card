import { ReactNode } from "react";
import { userStore } from "../store/user-store.ts";
import { cn } from "./cn.ts";

type Props = {
  text: ReactNode;
  children: ReactNode;
  isRequired?: boolean;
  // Helps to avoid nested <label> tags
  isPlain?: boolean;
  slotRight?: ReactNode;
  fullWidth?: boolean;
};

export function Label(props: Props) {
  const Tag = props.isPlain ? "span" : "label";
  const { slotRight, fullWidth } = props;

  return (
    <Tag
      className={cn("reset-label flex flex-col gap-0.5", fullWidth && "w-full")}
    >
      <div
        className={cn("flex items-center", userStore.isRtl ? "mr-3" : "ml-3")}
      >
        <span className="text-hint uppercase text-sm">{props.text}</span>
        {props.isRequired && <span className="pl-1 text-danger">*</span>}
        {slotRight && (
          <span
            className={cn(
              "text-sm",
              userStore.isRtl ? "mr-auto ml-3" : "ml-auto mr-3",
            )}
          >
            {slotRight}
          </span>
        )}
      </div>
      {props.children}
    </Tag>
  );
}
