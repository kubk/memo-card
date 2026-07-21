import { DeckCardDbType } from "api";
import { CardNumber } from "../../../ui/card-number.tsx";
import { removeAllTags } from "../../../lib/sanitize-html/remove-all-tags.ts";
import { List, type ListItemType } from "../../../ui/list.tsx";
import { userStore } from "../../../store/user-store.ts";
import { cn } from "../../../ui/cn.ts";
import { Skeleton } from "../../../ui/skeleton.tsx";

type CardListRowsReadonlyProps = {
  cards: DeckCardDbType[];
  onClick: (card: DeckCardDbType) => void;
  additionalItems?: ListItemType[];
};

const skeletonRows = [0, 1, 2];

export function CardListRowsReadonlyLoading() {
  return (
    <List
      items={[
        ...skeletonRows.map(() => ({
          text: (
            <div className="flex h-12 w-72 max-w-[70vw] flex-col justify-center gap-2 text-hint">
              <Skeleton className="h-3.5 w-5/12 rounded" />
              <Skeleton className="h-3.5 w-7/12 rounded" />
            </div>
          ),
        })),
        {
          text: (
            <span className="flex h-6 w-20 items-center text-hint">
              <Skeleton className="h-3.5 w-full rounded" />
            </span>
          ),
          alignCenter: true,
        },
      ]}
    />
  );
}

export function CardListRowsReadonly(props: CardListRowsReadonlyProps) {
  const { cards, onClick, additionalItems = [] } = props;

  return (
    <List
      items={[
        ...cards.map((card, i) => ({
          onClick: () => {
            onClick(card);
          },
          text: (
            <div
              className={cn(
                "cursor-pointer bg-bg rounded-[12px] max-h-[120px] overflow-hidden",
                userStore.isRtl && "text-right",
              )}
            >
              <div>
                <CardNumber number={i + 1} />
                <span className="text-md">
                  {removeAllTags({ text: card.front })}
                </span>
              </div>
              <div className="text-hint">
                {removeAllTags({ text: card.back })}
              </div>
            </div>
          ),
        })),
        ...additionalItems,
      ]}
    />
  );
}
