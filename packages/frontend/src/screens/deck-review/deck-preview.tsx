import { useReviewStore } from "./store/review-store-context.tsx";
import { screenStore } from "../../store/screen-store.ts";
import { Hint } from "../../ui/hint.tsx";
import { useBackButton } from "../../lib/platform/use-back-button.ts";
import { useMainButton } from "../../lib/platform/use-main-button.ts";
import { ButtonSideAligned } from "../../ui/button-side-aligned.tsx";
import { useProgress } from "../../lib/platform/use-progress.tsx";
import { t } from "../../translations/t.ts";
import { ButtonGrid } from "../../ui/button-grid.tsx";
import { Button } from "../../ui/button.tsx";
import { DeckFolderDescription } from "../shared/deck-folder-description.tsx";
import { Flex } from "../../ui/flex.tsx";
import { BrowserBackButton } from "../shared/browser-platform/browser-back-button.tsx";
import { ListHeader } from "../../ui/list-header.tsx";
import { cn } from "../../ui/cn.ts";
import { CardReviewStats } from "../shared/deck-stats/card-review-stats.tsx";
import { PencilIcon, PlusIcon, RefreshCwIcon } from "lucide-react";
import { type DeckScreenStore } from "./store/deck-screen-store.ts";
import { ErrorScreen } from "../error-screen/error-screen.tsx";
import {
  CardListRowsReadonly,
  CardListRowsReadonlyLoading,
} from "./preview-readonly/card-list-readonly.tsx";
import { DeckActions } from "../shared/deck-actions.tsx";

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

  useMainButton(t("review_deck"), onStart, () => store.canReview, [], {
    forceHide: true,
  });

  if (store.detailsQuery.error) {
    return <ErrorScreen />;
  }

  const deck = store.deck;
  if (!deck) {
    return null;
  }

  const previewCards = deck.deckCards.slice(0, 3);

  return (
    <Flex direction={"column"} gap={16} pb={82}>
      <div>
        <ListHeader text={t("deck")} />
        <div className="flex flex-col gap-4 rounded-[12px] px-4 pb-4 pt-0 bg-bg">
          <div className={cn("flex items-start gap-1.5")}>
            <BrowserBackButton className="mt-3" />
            <h3 className={cn("min-w-0 flex-1 pt-3")}>{deck.name}</h3>
            <DeckActions deck={deck} variant="dropdown" />
          </div>
          <div>
            <DeckFolderDescription deck={deck} />
          </div>

          <CardReviewStats
            isLoading={store.isInitialLoading}
            newCardsCount={
              deck.cardsToReview.filter((card) => card.type === "new").length
            }
            repeatCardsCount={
              deck.cardsToReview.filter((card) => card.type === "repeat").length
            }
            totalCardsCount={deck.deckCards.length}
          />
        </div>
        {store.canEdit ? (
          <div className="mt-3">
            <ButtonGrid>
              <ButtonSideAligned
                icon={<PlusIcon size={24} />}
                outline
                onClick={() => {
                  screenStore.push({
                    type: "deckForm",
                    deckId: deck.id,
                    cardId: "new",
                  });
                }}
              >
                {t("add_card_short")}
              </ButtonSideAligned>

              <ButtonSideAligned
                icon={<PencilIcon size={24} />}
                outline
                onClick={() => {
                  screenStore.push({ type: "deckForm", deckId: deck.id });
                }}
              >
                {t("edit")}
              </ButtonSideAligned>
            </ButtonGrid>
          </div>
        ) : null}
      </div>

      {store.isInitialLoading || previewCards.length > 0 ? (
        <div className="pb-5">
          <ListHeader text={t("cards")} />
          {store.isInitialLoading ? (
            <CardListRowsReadonlyLoading />
          ) : (
            <CardListRowsReadonly
              cards={previewCards}
              onClick={(card) => {
                screenStore.push({
                  type: "cardPreviewId",
                  cardId: card.id,
                  deckId: deck.id,
                });
              }}
              additionalItems={
                deck.deckCards.length > previewCards.length
                  ? [
                      {
                        text: t("view_more"),
                        isLinkColor: true,
                        alignCenter: true,
                        onClick: () => {
                          screenStore.push({
                            type: "cardListPreview",
                            deckId: deck.id,
                            state: { deck },
                          });
                        },
                      },
                    ]
                  : undefined
              }
            />
          )}
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
