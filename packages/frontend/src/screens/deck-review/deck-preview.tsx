import { deckListStore } from "../../store/deck-list-store.ts";
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
import { useScrollToTopOnMount } from "../../lib/react/use-scroll-to-top-mount.ts";
import { Flex } from "../../ui/flex.tsx";
import { BrowserBackButton } from "../shared/browser-platform/browser-back-button.tsx";
import { useHotkeys } from "react-hotkeys-hook";
import { platform } from "../../lib/platform/platform.ts";
import { BrowserPlatform } from "../../lib/platform/browser/browser-platform.ts";
import { ListHeader } from "../../ui/list-header.tsx";
import { cn } from "../../ui/cn.ts";
import { CardReviewStats } from "../shared/deck-stats/card-review-stats.tsx";
import { EyeIcon, PencilIcon, PlusIcon, RefreshCwIcon } from "lucide-react";

type Props = { onCardListPreview: () => void };

export function DeckPreview(props: Props) {
  const reviewStore = useReviewStore();

  useBackButton(() => {
    screenStore.back();
  });

  useProgress(() => deckListStore.deckWithCardsRequest.isLoading);
  useScrollToTopOnMount();

  const onStart = () => {
    if (deckListStore.canReview) {
      deckListStore.startDeckReview(reviewStore);
    }
  };

  useHotkeys("enter", onStart);

  useMainButton(t("review_deck"), onStart, () => deckListStore.canReview, [], {
    forceHide: true,
  });

  const deck = deckListStore.selectedDeck;
  if (!deck) {
    return null;
  }

  return (
    <Flex direction={"column"} gap={16} pb={82}>
      <div>
        <ListHeader text={t("deck")} />
        <div className="flex flex-col gap-4 rounded-[12px] px-4 pb-4 pt-0 bg-bg">
          <div className="relative">
            <div className="absolute left-0 top-1.5">
              <BrowserBackButton />
            </div>
            <h3
              className={cn(
                "pt-3",
                platform instanceof BrowserPlatform ? "pl-8" : "pl-0",
              )}
            >
              {deck.name}
            </h3>
          </div>
          <div>
            <DeckFolderDescription deck={deck} />
          </div>

          <CardReviewStats
            isLoading={deckListStore.deckWithCardsRequest.isLoading}
            newCardsCount={
              deck.cardsToReview.filter((card) => card.type === "new").length
            }
            repeatCardsCount={
              deck.cardsToReview.filter((card) => card.type === "repeat").length
            }
            totalCardsCount={deck.deckCards.length}
          />

          <ButtonGrid>
            {deckListStore.canEditDeck ? (
              <ButtonSideAligned
                icon={<PlusIcon size={24} />}
                outline
                onClick={() => {
                  screenStore.goOnce({
                    type: "cardQuickAddForm",
                    deckId: deck.id,
                  });
                }}
              >
                {t("add_card_short")}
              </ButtonSideAligned>
            ) : null}

            {!deckListStore.canEditDeck && (
              <ButtonSideAligned
                icon={<EyeIcon size={24} />}
                outline
                onClick={() => {
                  props.onCardListPreview();
                }}
              >
                {t("view")}
              </ButtonSideAligned>
            )}

            {deckListStore.canEditDeck ? (
              <ButtonSideAligned
                icon={<PencilIcon size={24} />}
                outline
                onClick={() => {
                  screenStore.goToDeckForm({ deckId: deck.id });
                }}
              >
                {t("edit")}
              </ButtonSideAligned>
            ) : null}
          </ButtonGrid>
        </div>
      </div>

      {!deckListStore.deckWithCardsRequest.isLoading &&
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
                  reviewStore.startDeckReviewAnyway(deckListStore.selectedDeck);
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
