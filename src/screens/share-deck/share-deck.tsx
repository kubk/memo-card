import { observer } from "mobx-react-lite";
import { css } from "@emotion/css";
import React from "react";
import { screenStore } from "../../store/screen-store.ts";
import { assert } from "../../lib/typescript/assert.ts";
import { useBackButton } from "../../lib/telegram/use-back-button.tsx";
import { ShareDeckButton } from "../deck-review/share-deck-button.tsx";
import { HintTransparent } from "../../ui/hint-transparent.tsx";

export const ShareDeck = observer(() => {
  const screen = screenStore.screen;
  assert(screen.type === "shareDeck", "Screen is not shareDeck");

  useBackButton(() => {
    screenStore.back();
  })

  return <div
    className={css({
      display: "flex",
      flexDirection: "column",
      gap: 16,
      marginBottom: 16,
      position: "relative",
    })}
  >
    <h3 className={css({ textAlign: "center" })}>Share settings</h3>
    <ShareDeckButton/>
    <HintTransparent>This link never changes, anyone can copy it</HintTransparent>
  </div>
})
