import { observer } from "mobx-react-lite";
import { deckListStore } from "../../store/deck-list-store.ts";
import { assert } from "../../lib/typescript/assert.ts";
import { css } from "@emotion/css";
import { theme } from "../../ui/theme.tsx";
import React from "react";
import { useReviewStore } from "../../store/review-store-context.tsx";
import { screenStore } from "../../store/screen-store.ts";
import { Hint } from "../../ui/hint.tsx";
import { Button } from "../../ui/button.tsx";
import { ShareDeckButton } from "./share-deck-button.tsx";
import { useBackButton } from "../../lib/telegram/use-back-button.tsx";
import { useMainButton } from "../../lib/telegram/use-main-button.tsx";

export const DeckPreview = observer(() => {
  const reviewStore = useReviewStore();
  const deck = deckListStore.selectedDeck;
  assert(deck, "Deck should not be empty before preview");

  useBackButton(() => {
    screenStore.navigateToMain();
  });

  useMainButton(
    "Review deck",
    () => {
      deckListStore.startReview(reviewStore);
    },
    () => deckListStore.canReview,
  );

  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        gap: 16,
        paddingTop: 12,
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
        <div className={css({ display: "flex", gap: 4 })}>
          <h4>Cards available to review: </h4>
          <span>{deck.cardsToReview.length}</span>
        </div>
        <div className={css({ display: "flex", gap: 4 })}>
          <h4 className={css({ paddingBottom: 4 })}>Total cards: </h4>
          <span>{deck.deck_card.length}</span>
        </div>

        <div className={css({ display: "flex", gap: 16 })}>
          <ShareDeckButton deckId={deck.id} shareId={deck.share_id} />
          {deckListStore.myId && deck.author_id === deckListStore.myId ? (
            <Button
              icon={"mdi-pencil"}
              noPseudoClasses
              outline
              onClick={() => {
                screenStore.navigateToDeckForm(deck.id);
              }}
            >
              Edit
            </Button>
          ) : null}
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
