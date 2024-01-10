import { observer } from "mobx-react-lite";
import { t } from "../../translations/t.ts";
import { css } from "@emotion/css";
import { theme } from "../../ui/theme.tsx";
import { screenStore } from "../../store/screen-store.ts";
import { translateNewCardsCount } from "../../translations/translate-new-cards-count.tsx";
import React from "react";

type Props = {
  newCardsCount?: number | null;
};

export const WantMoreCardsButton = observer((props: Props) => {
  const { newCardsCount } = props;

  if (!newCardsCount) {
    return null;
  }

  return (
    <>
      {t("review_finished_want_more")}{" "}
      <span
        className={css({
          color: theme.linkColor,
          cursor: "pointer",
        })}
        onClick={() => {
          screenStore.go({ type: "main" });
        }}
      >
        {newCardsCount} {translateNewCardsCount(newCardsCount)}
      </span>{" "}
      {t("review_finished_to_review")}
    </>
  );
});
