import { ReactNode } from "preact/compat";
import { userStore } from "../store/user-store.ts";
import { cn } from "./cn.ts";

type Props = {
  children: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  isRequired?: boolean;
  isLabel?: boolean;
  fullWidth?: boolean;
  slotRight?: ReactNode;
  className?: string;
};

export function LabelGroup({
  children,
  title,
  description,
  isRequired,
  isLabel,
  fullWidth,
  slotRight,
  className,
}: Props) {
  const hasTitle = title != null || isRequired || slotRight != null;
  const Tag = isLabel ? "label" : "div";

  return (
    <Tag
      className={cn(
        "reset-label flex flex-col gap-0.5",
        fullWidth && "w-full",
        className,
      )}
    >
      {hasTitle && (
        <div
          className={cn(
            "flex items-center text-hint text-sm",
            userStore.isRtl ? "mr-3" : "ml-3",
          )}
        >
          {typeof title === "string" ? (
            <span className="uppercase">{title}</span>
          ) : (
            title
          )}
          {isRequired && <span className="pl-1 text-danger">*</span>}
          {slotRight && (
            <span
              className={cn(
                "flex items-center",
                userStore.isRtl ? "mr-auto ml-3" : "ml-auto mr-3",
              )}
            >
              {slotRight}
            </span>
          )}
        </div>
      )}
      {children}
      {description != null && (
        <div className="text-sm px-3 rounded-xl text-hint normal-case">
          {description}
        </div>
      )}
    </Tag>
  );
}
