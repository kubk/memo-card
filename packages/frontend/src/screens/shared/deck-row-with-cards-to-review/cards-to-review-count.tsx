import { cn } from "../../../ui/cn.ts";

type Props = {
  items: Array<unknown> | number;
  color: string;
  isDisabled?: boolean;
};

export function CardsToReviewCount(props: Props) {
  const { items, color, isDisabled } = props;
  const count = Array.isArray(items) ? items.length : items;

  return count > 0 ? (
    <div
      className={cn("font-semibold", {
        "text-gray-500": isDisabled,
      })}
      style={!isDisabled ? { color } : undefined}
    >
      {count}
    </div>
  ) : null;
}
