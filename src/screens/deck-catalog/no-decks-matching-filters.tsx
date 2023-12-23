import { css } from "@emotion/css";
import { theme } from "../../ui/theme.tsx";
import React from "react";
import { t } from "../../translations/t.ts";

export const NoDecksMatchingFilters = () => {
  return (
    <div
      className={css({
        marginTop: 150,
        alignSelf: "center",
        textAlign: "center",
      })}
    >
      <div className={css({ fontWeight: 500 })}>
        {t("deck_search_not_found")}
      </div>
      <div className={css({ fontSize: 14, color: theme.hintColor })}>
        {t("deck_search_not_found_description")}
      </div>
    </div>
  );
};
