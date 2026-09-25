import { cn } from "../../../ui/cn.ts";

type Props = {
  items: Array<unknown> | number;
  className?: string;
  isDisabled?: boolean;
};

export function CardsToReviewCount(props: Props) {
  const { items, className, isDisabled } = props;
  const count = Array.isArray(items) ? items.length : items;

  return count > 0 ? (
    <div
      className={cn(
        "font-semibold",
        !isDisabled && className,
        isDisabled && "text-gray-500",
      )}
    >
      {count}
    </div>
  ) : null;
}
