import { css } from "@emotion/css";
import { theme } from "../../ui/theme.tsx";
import React from "react";

export const NoDecksMatchingFilters = () => {
  return (
    <div
      className={css({
        marginTop: 150,
        alignSelf: "center",
        textAlign: "center",
      })}
    >
      <div className={css({ fontWeight: 500 })}>No decks found</div>
      <div className={css({ fontSize: 14, color: theme.hintColor })}>
        Try updating filters to see more decks
      </div>
    </div>
  );
};
