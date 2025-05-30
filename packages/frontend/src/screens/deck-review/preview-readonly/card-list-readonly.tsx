import { DeckCardDbType } from "api";
import { Screen } from "../../shared/screen.tsx";
import { t } from "../../../translations/t.ts";
import { CardNumber } from "../../../ui/card-number.tsx";
import { removeAllTags } from "../../../lib/sanitize-html/remove-all-tags.ts";
import { useBackButton } from "../../../lib/platform/use-back-button.ts";
import { DeckWithCardsWithReviewType } from "../../../store/deck-list-store.ts";
import { List } from "../../../ui/list.tsx";
import { ListHeader } from "../../../ui/list-header.tsx";
import { DeckFolderDescription } from "../../shared/deck-folder-description.tsx";
import { userStore } from "../../../store/user-store.ts";
import { cn } from "../../../ui/cn.ts";

type Props = {
  onBack: () => void;
  cards: DeckCardDbType[];
  onClick: (card: DeckCardDbType) => void;
  deck?: DeckWithCardsWithReviewType;
  subtitle: string;
};

export function CardListReadonly(props: Props) {
  const { cards, onClick, onBack, deck, subtitle } = props;

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
      {deck ? (
        <div>
          <ListHeader text={t("deck")} />
          <div className="flex flex-col gap-2 rounded-[12px] px-4 pb-4 pt-2 bg-bg">
            <h3 className="pt-2">{deck.name}</h3>
            <DeckFolderDescription isExpanded deck={deck} />
          </div>
        </div>
      ) : null}
      <div>
        <ListHeader text={t("cards")} />
        <List
          items={cards.map((card, i) => ({
            onClick: () => {
              onClick(card);
            },
            text: (
              <div
                key={i}
                className={cn(
                  "cursor-pointer bg-bg rounded-[12px] max-h-[120px] overflow-hidden",
                  userStore.isRtl && "text-right",
                )}
              >
                <div>
                  <CardNumber number={i + 1} />
                  <span className="text-md">{removeAllTags(card.front)}</span>
                </div>
                <div className="text-hint">{removeAllTags(card.back)}</div>
              </div>
            ),
          }))}
        />
      </div>
    </Screen>
  );
}
