import { useReviewStore } from "./store/review-store-context.tsx";
import { screenStore } from "../../store/screen-store.ts";
import { Hint } from "../../ui/hint.tsx";
import { useBackButton } from "../../lib/platform/use-back-button.ts";
import { useMainButton } from "../../lib/platform/use-main-button.ts";
import { useProgress } from "../../lib/platform/use-progress.tsx";
import { t } from "../../translations/t.ts";
import { Button } from "../../ui/button.tsx";
import { DeckFolderDescription } from "../shared/deck-folder-description.tsx";
import { Flex } from "../../ui/flex.tsx";
import { BrowserBackButton } from "../shared/browser-platform/browser-back-button.tsx";
import { LabelGroup } from "../../ui/label-group.tsx";
import { cn } from "../../ui/cn.ts";
import {
  ActionTileRow,
  type ActionTileRowItem,
} from "../../ui/action-tile.tsx";
import { PlusIcon, RefreshCwIcon } from "lucide-react";
import { type DeckScreenStore } from "./store/deck-screen-store.ts";
import { ErrorScreen } from "../error-screen/error-screen.tsx";
import { DeckNotFoundScreen } from "../error-screen/deck-not-found-screen.tsx";
import {
  CardListRowsReadonly,
  CardListRowsReadonlyLoading,
} from "./preview-readonly/card-list-readonly.tsx";
import { getDeckTileActions } from "../shared/deck-actions.tsx";
import { isTrpcNotFoundError } from "../../api/is-trpc-not-found-error.ts";
import { getCardsToReviewTileItems } from "../../ui/cards-to-review.tsx";

type Props = {
  store: DeckScreenStore;
};

export function DeckPreview(props: Props) {
  const reviewStore = useReviewStore();
  const { store } = props;

  useBackButton(() => {
    screenStore.back();
  });

  useProgress(() => store.isInitialLoading);

  const onStart = () => {
    if (store.canReview) {
      store.startReview(reviewStore);
    }
  };

  useMainButton(t("review_deck"), onStart, () => store.canReview);

  if (isTrpcNotFoundError(store.detailsQuery.error)) {
    return <DeckNotFoundScreen />;
  }

  if (store.detailsQuery.error) {
    return <ErrorScreen />;
  }

  const deck = store.deck;
  if (!deck) {
    return null;
  }

  const previewCards = deck.deckCards.slice(0, 3);
  const deckTileActions = getDeckTileActions(deck, store.canEdit);

  const items: ActionTileRowItem[] = [
    ...(store.canEdit
      ? [
          {
            type: "action" as const,
            icon: <PlusIcon size={24} />,
            text: t("add_card_short"),
            onClick: () => {
              screenStore.push({
                type: "deckForm",
                deckId: deck.id,
                cardId: "new",
              });
            },
          },
        ]
      : []),
    ...getCardsToReviewTileItems(deck, store.isInitialLoading, (cardType) => {
      reviewStore.startDeckReview(deck, (card) => card.type === cardType);
    }),
    ...(deckTileActions ? [deckTileActions] : []),
  ];

  return (
    <Flex direction={"column"} gap={16} pb={82}>
      <div>
        <LabelGroup title={t("deck")}>
          <div className="flex flex-col gap-4 rounded-[12px] px-4 pb-4 pt-0 bg-bg">
            <div className={cn("flex items-start gap-1.5")}>
              <BrowserBackButton className="mt-3" />
              <h3 className={cn("min-w-0 flex-1 pt-3")}>{deck.name}</h3>
            </div>
            <div>
              <DeckFolderDescription deck={deck} />
            </div>
          </div>
        </LabelGroup>

        <ActionTileRow className="mt-2" items={items} />
      </div>

      {store.isInitialLoading || previewCards.length > 0 ? (
        <div className="pb-5">
          <LabelGroup title={t("cards")}>
            {store.isInitialLoading ? (
              <CardListRowsReadonlyLoading />
            ) : (
              <CardListRowsReadonly
                cards={previewCards}
                onClick={(card) => {
                  store.openCard(card.id);
                }}
                additionalItems={
                  deck.deckCards.length > previewCards.length
                    ? [
                        {
                          text: t("view_more"),
                          isLinkColor: true,
                          alignCenter: true,
                          onClick: store.openCardList,
                        },
                      ]
                    : undefined
                }
              />
            )}
          </LabelGroup>
        </div>
      ) : null}

      {!store.isInitialLoading &&
      deck.cardsToReview.length === 0 &&
      deck.deckCards.length > 0 ? (
        <>
          <Hint>
            <Flex direction={"column"} gap={10} mb={4}>
              <div>{t("no_cards_to_review_in_deck")}</div>
              <Button
                outline
                icon={<RefreshCwIcon size={24} />}
                onClick={() => {
                  reviewStore.startDeckReviewAnyway(store.deck);
                }}
              >
                {t("repeat_cards_anyway")}
              </Button>
            </Flex>
          </Hint>
        </>
      ) : null}
    </Flex>
  );
}
