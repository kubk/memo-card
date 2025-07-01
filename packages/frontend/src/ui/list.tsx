import { ReactNode } from "react";
import { userStore } from "../store/user-store.ts";
import { cn } from "./cn.ts";

export type ListItemType = {
  text: ReactNode;
  isLinkColor?: boolean;
  onClick?: () => void;
  icon?: ReactNode;
  right?: ReactNode;
  alignCenter?: boolean;
};

type Props = {
  items: Array<ListItemType>;
  animateTap?: boolean;
};

export function List(props: Props) {
  const { items } = props;
  const animateTap =
    items.length > 1
      ? false
      : props.animateTap === undefined
      ? true
      : props.animateTap;

  return (
    <div className="flex flex-col">
      {items.map((item, i) => {
        const showDivider = i !== items.length - 1;
        return (
          <div
            key={i}
            onClick={item.onClick}
            className={cn(
              "box-border flex items-center cursor-pointer gap-2 pl-3 bg-bg",
              item.alignCenter ? "justify-center" : "justify-between",
              userStore.isRtl && "pr-3",
              "first:rounded-t-xl last:rounded-b-xl",
              animateTap &&
                "active:scale-[0.98] active:transition-transform active:duration-300 active:origin-center",
            )}
          >
            <div
              className={cn(
                "text-text flex items-center gap-2",
                item.alignCenter ? "mr-3" : "w-full",
              )}
            >
              {item.icon}
              <div
                className={cn(
                  "flex justify-between select-none items-center flex-1 py-3",
                  showDivider && "border-b border-secondary-bg",
                )}
              >
                <span className={item.isLinkColor ? "text-link" : undefined}>
                  {item.text}
                </span>
                {item.right && <div className="mr-2.5">{item.right}</div>}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
