import { observer } from "mobx-react-lite";
import { deckListStore } from "../../store/deck-list-store.ts";
import { css } from "@emotion/css";
import { theme } from "../../ui/theme.tsx";
import React from "react";
import { useReviewStore } from "../../store/review-store-context.tsx";
import { screenStore } from "../../store/screen-store.ts";
import { Hint } from "../../ui/hint.tsx";
import { ShareDeckButton } from "./share-deck-button.tsx";
import { useBackButton } from "../../lib/telegram/use-back-button.tsx";
import { useMainButton } from "../../lib/telegram/use-main-button.tsx";
import { showConfirm } from "../../lib/telegram/show-confirm.ts";
import { ButtonSideAligned } from "../../ui/button-side-aligned.tsx";

export const DeckPreview = observer(() => {
  const reviewStore = useReviewStore();

  useBackButton(() => {
    screenStore.go({ type: "main" });
  });

  useMainButton(
    "Review deck",
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
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        gap: 16,
        paddingTop: 12,
        paddingBottom: 12,
      })}
    >
      <div
        className={css({
          display: "flex",
          flexDirection: "column",
          gap: 16,
          borderRadius: theme.borderRadius,
          padding: "8px 16px",
          paddingBottom: 12,
          background: theme.secondaryBgColor,
        })}
      >
        <div
          className={css({
            position: "relative",
            textAlign: "center",
          })}
        >
          <h3 className={css({ paddingTop: 12 })}>{deck.name}</h3>
        </div>
        <div>
          <h4 className={css({ paddingBottom: 4 })}>Description</h4>
          <div>{deck.description}</div>
        </div>
        <div
          className={css({
            display: "flex",
            gap: 4,
            flexDirection: "column",
            borderTop: `1px solid ${theme.dividerColor}`,
            paddingTop: 8,
          })}
        >
          <div className={css({ display: "flex", gap: 4 })}>
            <span>Cards to repeat: </span>
            <h4 className={css({ color: theme.orange })}>
              {
                deck.cardsToReview.filter((card) => card.type === "repeat")
                  .length
              }
            </h4>
          </div>
          <div className={css({ display: "flex", gap: 4 })}>
            <span>New cards: </span>
            <h4 className={css({ color: theme.success })}>
              {deck.cardsToReview.filter((card) => card.type === "new").length}
            </h4>
          </div>
          <div className={css({ display: "flex", gap: 4 })}>
            <span>Total cards: </span>
            <h4>{deck.deck_card.length}</h4>
          </div>
        </div>

        <div
          className={css({
            gap: 16,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
          })}
        >
          {deckListStore.myId && deck.author_id === deckListStore.myId ? (
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
              Add card
            </ButtonSideAligned>
          ) : null}
          {deckListStore.myId && deck.author_id === deckListStore.myId ? (
            <ButtonSideAligned
              icon={"mdi-pencil-circle mdi-24px"}
              outline
              onClick={() => {
                screenStore.go({ type: "deckForm", deckId: deck.id });
              }}
            >
              Edit
            </ButtonSideAligned>
          ) : null}
          {screenStore.screen.type === "deckMine" ? (
            <ButtonSideAligned
              icon={"mdi-delete-circle mdi-24px"}
              outline
              onClick={() => {
                showConfirm(
                  "Are you sure to remove the deck from your collection? This action can't be undone",
                ).then(() => {
                  deckListStore.removeDeck();
                });
              }}
            >
              Delete
            </ButtonSideAligned>
          ) : null}

          <ShareDeckButton shareId={deck.share_id} />
        </div>
      </div>
      {deck.cardsToReview.length === 0 && (
        <Hint>
          Amazing work! 🌟 You've reviewed all the cards in this deck for now.
          Come back later for more.
        </Hint>
      )}
    </div>
  );
});
