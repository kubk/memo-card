import { observer } from "mobx-react-lite";
import { useDeckFormStore } from "../../store/deck-form-store-context.tsx";
import { screenStore } from "../../store/screen-store.ts";
import { assert } from "../../lib/typescript/assert.ts";
import { useBackButton } from "../../lib/telegram/use-back-button.tsx";
import { css } from "@emotion/css";
import { Input } from "../../ui/input.tsx";
import { theme } from "../../ui/theme.tsx";
import { Button } from "../../ui/button.tsx";
import React from "react";

export const CardList = observer(() => {
  const deckFormStore = useDeckFormStore();
  const screen = screenStore.screen;
  assert(screen.type === "deckForm");

  useBackButton(() => {
    deckFormStore.quitCardList();
  });

  if (!deckFormStore.form) {
    return null;
  }

  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        gap: 6,
        marginBottom: 16
      })}
    >
      <h4 className={css({ textAlign: "center" })}>Cards</h4>
      {deckFormStore.form.cards.length > 1 && (
        <Input field={deckFormStore.cardFilter} placeholder={"Search card"} />
      )}
      {deckFormStore.filteredCards.map((cardForm, i) => (
        <div
          onClick={() => {
            deckFormStore.editCardForm(i);
          }}
          key={i}
          className={css({
            cursor: "pointer",
            backgroundColor: theme.secondaryBgColor,
            borderRadius: theme.borderRadius,
            padding: 12
          })}
        >
          <div>{cardForm.front.value}</div>
          <div className={css({ color: theme.hintColor })}>
            {cardForm.back.value}
          </div>
        </div>
      ))}
      <Button
        onClick={() => {
          deckFormStore.openNewCardForm();
        }}
      >
        Add card
      </Button>
    </div>
  );
});
