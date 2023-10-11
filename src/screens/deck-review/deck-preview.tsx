import { observer } from "mobx-react-lite";
import { deckListStore } from "../../store/deck-list-store.ts";
import { assert } from "../../lib/typescript/assert.ts";
import { css, cx } from "@emotion/css";
import { theme } from "../../ui/theme.tsx";
import WebApp from "@twa-dev/sdk";
import { motion } from "framer-motion";
import { whileTap } from "../../ui/animations.ts";
import React from "react";
import { useReviewStore } from "../../store/review-store-context.tsx";
import { useMount } from "../../lib/react/use-mount.ts";
import { Screen, screenStore } from "../../store/screen-store.ts";
import { Hint } from "../../ui/hint.tsx";
import { Button } from "../../ui/button.tsx";
import { ShareDeckButton } from "./share-deck-button.tsx";

export const DeckPreview = observer(() => {
  const reviewStore = useReviewStore();
  const deck = deckListStore.selectedDeck;
  assert(deck);

  useMount(() => {
    if (!deck.cardsToReview.length && screenStore.screen === Screen.DeckMine) {
      return;
    }

    WebApp.MainButton.show();
    WebApp.MainButton.setText("Review deck");
    const onClick = () => {
      assert(deckListStore.selectedDeck);

      if (screenStore.screen === Screen.DeckPublic) {
        deckListStore.addDeckToMine(deckListStore.selectedDeck.id);
      }

      reviewStore.startDeckReview(deckListStore.selectedDeck.cardsToReview);
    };
    WebApp.MainButton.onClick(onClick);

    return () => {
      WebApp.MainButton.hide();
      WebApp.MainButton.offClick(onClick);
    };
  });

  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        gap: 16,
      })}
    >
      <div
        className={css({
          display: "flex",
          flexDirection: "column",
          gap: 16,
          borderRadius: 8,
          padding: "8px 12px",
          background: theme.secondaryBgColor,
        })}
      >
        <div
          className={css({
            position: "relative",
            textAlign: "center",
          })}
        >
          <motion.i
            whileTap={whileTap}
            onClick={() => {
              screenStore.navigateToMain();
            }}
            className={cx(
              "mdi mdi-chevron-left mdi-24px",
              css({
                position: "absolute",
                left: -5,
                top: 9,
                cursor: "pointer",
              }),
            )}
          />
          <h3 className={css({ paddingTop: 12 })}>{deck.name}</h3>
        </div>
        <div>
          <h4 className={css({ paddingBottom: 4 })}>Description</h4>
          <div>{deck.description}</div>
        </div>
        <div className={css({ display: "flex", gap: 4 })}>
          <h4 className={css({ paddingBottom: 4 })}>
            Cards available to review:{" "}
          </h4>
          <span>{deck.cardsToReview.length}</span>
        </div>
      </div>
      {deck.cardsToReview.length === 0 && (
        <Hint>
          Amazing work! 🌟 You've reviewed all the cards in this deck for now.
          Come back later for more.
        </Hint>
      )}
      {deckListStore.myId && deck.author_id === deckListStore.myId ? (
        <div className={css({ display: "flex", gap: 16 })}>
          <ShareDeckButton deckId={deck.id} defaultShareId={deck.share_id} />
          <Button
            icon={"mdi-pencil"}
            onClick={() => {
              screenStore.navigateToDeckForm(deck.id);
            }}
          >
            Edit
          </Button>
        </div>
      ) : null}
    </div>
  );
});
