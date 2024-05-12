import { observer } from "mobx-react-lite";
import { deckListStore } from "../../store/deck-list-store.ts";
import { css } from "@emotion/css";
import { theme } from "../../ui/theme.tsx";
import React from "react";
import { useReviewStore } from "./store/review-store-context.tsx";
import { screenStore } from "../../store/screen-store.ts";
import { Hint } from "../../ui/hint.tsx";
import { useBackButton } from "../../lib/platform/use-back-button.ts";
import { useMainButton } from "../../lib/platform/use-main-button.ts";
import { showConfirm } from "../../lib/platform/show-confirm.ts";
import { ButtonSideAligned } from "../../ui/button-side-aligned.tsx";
import { useProgress } from "../../lib/platform/use-progress.tsx";
import { t } from "../../translations/t.ts";
import { ButtonGrid } from "../../ui/button-grid.tsx";
import { Button } from "../../ui/button.tsx";
import { DeckFolderDescription } from "../shared/deck-folder-description.tsx";
import { useScrollToTopOnMount } from "../../lib/react/use-scroll-to-top-mount.ts";
import { userStore } from "../../store/user-store.ts";
import { redirectUserToDeckOrFolderLink } from "../share-deck/redirect-user-to-deck-or-folder-link.tsx";
import { Flex } from "../../ui/flex.tsx";

export const DeckPreview = observer(() => {
  const reviewStore = useReviewStore();

  useBackButton(() => {
    screenStore.back();
  });

  useProgress(() => deckListStore.deckWithCardsRequest.isLoading);
  useScrollToTopOnMount();

  useMainButton(
    t("review_deck"),
    () => {
      deckListStore.startDeckReview(reviewStore);
    },
    () => deckListStore.canReview,
  );

  const deck = deckListStore.selectedDeck;
  if (!deck) {
    return null;
  }

  return (
    <Flex direction={"column"} gap={16} pt={12} pb={12}>
      <div
        className={css({
          display: "flex",
          flexDirection: "column",
          gap: 16,
          borderRadius: theme.borderRadius,
          padding: "8px 16px",
          paddingBottom: 16,
          background: theme.bgColor,
        })}
      >
        <div
          className={css({
            position: "relative",
            textAlign: "center",
          })}
        >
          <h3
            className={css({
              paddingTop: 12,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 6,
            })}
          >
            <i className={"mdi mdi-cards-outline"} title={t("deck")} />
            {deck.name}
          </h3>
        </div>
        <div>
          <DeckFolderDescription deck={deck} />
        </div>
        {!deckListStore.deckWithCardsRequest.isLoading && (
          <div
            className={css({
              display: "flex",
              gap: 4,
              flexDirection: "column",
              borderTop: `1px solid ${theme.divider}`,
              paddingTop: 8,
            })}
          >
            <Flex gap={4}>
              <span>{t("cards_to_repeat")}: </span>
              <h4 className={css({ color: theme.orange })}>
                {
                  deck.cardsToReview.filter((card) => card.type === "repeat")
                    .length
                }
              </h4>
            </Flex>
            <Flex gap={4}>
              <span>{t("cards_new")}: </span>
              <h4 className={css({ color: theme.success })}>
                {
                  deck.cardsToReview.filter((card) => card.type === "new")
                    .length
                }
              </h4>
            </Flex>
            <Flex gap={4}>
              <span>{t("cards_total")}: </span>
              <h4>{deck.deck_card.length}</h4>
            </Flex>
          </div>
        )}

        <ButtonGrid>
          {deckListStore.canEditDeck ? (
            <ButtonSideAligned
              icon={"mdi-plus-circle mdi-24px"}
              outline
              onClick={() => {
                screenStore.go({
                  type: "cardQuickAddForm",
                  deckId: deck.id,
                });
              }}
            >
              {t("add_card_short")}
            </ButtonSideAligned>
          ) : null}
          {deckListStore.canDuplicateSelectedDeck && (
            <ButtonSideAligned
              icon={"mdi-content-duplicate mdi-24px"}
              outline
              onClick={() => {
                deckListStore.onDuplicateDeck(deck.id);
              }}
            >
              {t("duplicate")}
            </ButtonSideAligned>
          )}
          {deckListStore.canEditDeck ? (
            <ButtonSideAligned
              icon={"mdi-pencil-circle mdi-24px"}
              outline
              onClick={() => {
                screenStore.go({ type: "deckForm", deckId: deck.id });
              }}
            >
              {t("edit")}
            </ButtonSideAligned>
          ) : null}

          {deckListStore.canEditDeck && (
            <ButtonSideAligned
              icon={"mdi-share-circle mdi-24px"}
              outline
              onClick={() => {
                if (userStore.canAdvancedShare) {
                  screenStore.go({
                    type: "shareDeck",
                    deckId: deck.id,
                    shareId: deck.share_id,
                  });
                } else {
                  redirectUserToDeckOrFolderLink(deck.share_id);
                }
              }}
            >
              {t("share")}
            </ButtonSideAligned>
          )}

          {screenStore.screen.type === "deckMine" ? (
            <ButtonSideAligned
              icon={"mdi-delete-circle mdi-24px"}
              outline
              onClick={async () => {
                const isConfirmed = await showConfirm(t("delete_deck_confirm"));
                if (isConfirmed) {
                  deckListStore.removeDeck();
                }
              }}
            >
              {t("delete")}
            </ButtonSideAligned>
          ) : null}
        </ButtonGrid>
      </div>
      {deck.cardsToReview.length === 0 && (
        <>
          <Hint>
            <Flex direction={"column"} gap={10} mb={4}>
              <div>{t("no_cards_to_review_in_deck")}</div>
              <Button
                outline
                icon={"mdi-cached"}
                onClick={() => {
                  reviewStore.startDeckReviewAnyway(deckListStore.selectedDeck);
                }}
              >
                {t("repeat_cards_anyway")}
              </Button>
            </Flex>
          </Hint>
        </>
      )}
    </Flex>
  );
});
