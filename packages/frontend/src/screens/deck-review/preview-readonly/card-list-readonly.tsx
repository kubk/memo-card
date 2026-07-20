import { DeckCardDbType } from "api";
import { Screen } from "../../shared/screen.tsx";
import { t } from "../../../translations/t.ts";
import { CardNumber } from "../../../ui/card-number.tsx";
import { removeAllTags } from "../../../lib/sanitize-html/remove-all-tags.ts";
import { useBackButton } from "../../../lib/platform/use-back-button.ts";
import { List, type ListItemType } from "../../../ui/list.tsx";
import { ListHeader } from "../../../ui/list-header.tsx";
import { userStore } from "../../../store/user-store.ts";
import { cn } from "../../../ui/cn.ts";

type Props = {
  onBack: () => void;
  cards: DeckCardDbType[];
  onClick: (card: DeckCardDbType) => void;
  subtitle: string;
};

type CardListRowsReadonlyProps = {
  cards: DeckCardDbType[];
  onClick: (card: DeckCardDbType) => void;
  additionalItems?: ListItemType[];
};

const skeletonWidths = [
  ["w-5/12", "w-7/12"],
  ["w-4/12", "w-6/12"],
  ["w-6/12", "w-5/12"],
] as const;

export function CardListRowsReadonlyLoading() {
  return (
    <List
      items={[
        ...skeletonWidths.map(([frontWidth, backWidth]) => ({
          text: (
            <div className="flex h-12 w-72 max-w-[70vw] animate-pulse flex-col justify-center gap-2">
              <span
                className={cn(
                  "block h-3.5 rounded bg-hint opacity-20",
                  frontWidth,
                )}
              />
              <span
                className={cn(
                  "block h-3.5 rounded bg-hint opacity-20",
                  backWidth,
                )}
              />
            </div>
          ),
        })),
        {
          text: (
            <span className="flex h-6 w-20 items-center">
              <span className="block h-3.5 w-full animate-pulse rounded bg-hint opacity-20" />
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

export function CardListReadonly(props: Props) {
  const { cards, onClick, onBack, subtitle } = props;

  useBackButton(() => {
    onBack();
  });

  return (
    <Screen
      title={""}
      subtitle={
        <div className="text-center text-sm">
          <button
            onClick={() => {
              onBack();
            }}
            className="text-inherit text-link"
          >
            {subtitle}
          </button>
        </div>
      }
    >
      <div>
        <ListHeader text={t("cards")} />
        <CardListRowsReadonly cards={cards} onClick={onClick} />
      </div>
    </Screen>
  );
}
