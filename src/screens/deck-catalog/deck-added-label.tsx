import { css } from "@emotion/css";
import { theme } from "../../ui/theme.tsx";
import React from "react";

export const DeckAddedLabel = () => {
  return (
    <div
      className={css({
        position: "absolute",
        right: 0,
        top: 0,
        fontSize: 14,
        fontStyle: "normal",
        padding: "0 8px",
        borderRadius: theme.borderRadius,
        border: "1px solid " + theme.linkColor,
        color: theme.linkColor,
      })}
    >
      ADDED
    </div>
  );
};
