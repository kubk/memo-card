import { css, cx } from "@emotion/css";
import { theme } from "../../ui/theme.tsx";
import React from "react";
import { t } from "../../translations/t.ts";

export const DeckAddedLabel = () => {
  return (
    <div
      title={t("deck_has_been_added")}
      className={css({
        position: "absolute",
        right: 0,
        top: 0,
        borderRadius: theme.borderRadius,
        backgroundColor: theme.secondaryBgColor,
      })}
    >
      <i
        className={cx(
          "mdi mdi-check-circle",
          css({
            color: theme.linkColor,
          }),
        )}
      />
    </div>
  );
};
