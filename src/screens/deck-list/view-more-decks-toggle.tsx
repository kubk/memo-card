import { observer } from "mobx-react-lite";
import { css, cx } from "@emotion/css";
import { reset } from "../../ui/reset.ts";
import { theme } from "../../ui/theme.tsx";
import { deckListStore } from "../../store/deck-list-store.ts";
import { ChevronIcon } from "../../ui/chevron-icon.tsx";
import React from "react";

export const ViewMoreDecksToggle = observer(() => {
  return (
    <button
      className={cx(
        reset.button,
        css({
          position: "absolute",
          right: 12,
          top: 2,
          color: theme.linkColor,
          fontSize: 14,
          textTransform: "uppercase",
          display: "flex",
          alignItems: "center",
          gap: 4,
        }),
      )}
      onClick={deckListStore.isMyDecksExpanded.toggle}
    >
      <span className={css({ transform: "translateY(2px)" })}>
        <ChevronIcon
          direction={deckListStore.isMyDecksExpanded.value ? "top" : "bottom"}
        />
      </span>
      {deckListStore.isMyDecksExpanded.value ? "Hide" : "Show all"}
    </button>
  );
});
