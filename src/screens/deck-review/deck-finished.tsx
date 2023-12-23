import React from "react";
import { observer } from "mobx-react-lite";
import { DeckFinishedModal } from "./deck-finished-modal.tsx";
import { css } from "@emotion/css";
import { useReviewStore } from "../../store/review-store-context.tsx";
import { useMount } from "../../lib/react/use-mount.ts";
import { screenStore } from "../../store/screen-store.ts";
import { useMainButton } from "../../lib/telegram/use-main-button.tsx";
import { useTelegramProgress } from "../../lib/telegram/use-telegram-progress.tsx";
import { theme } from "../../ui/theme.tsx";
import { t } from "../../translations/t.ts";
import { translateNewCardsCount } from "../../translations/translate-new-cards-count.tsx";
import { getEncouragingMessage } from "../../translations/get-encouraging-message.tsx";

type Props = {
  type: "deck" | "repeat_all";
  newCardsCount?: number;
};

export const DeckFinished = observer((props: Props) => {
  const { type, newCardsCount } = props;
  const reviewStore = useReviewStore();

  useMount(() => {
    reviewStore.submitFinished();
  });
  useMainButton("Go back", () => {
    screenStore.go({ type: "main" });
  });
  useTelegramProgress(() => reviewStore.isReviewSending);

  return (
    <DeckFinishedModal marginTop={"32px"}>
      <div
        className={css({
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        })}
      >
        <p>
          {type === "deck" ? t("review_deck_finished") : t("review_all_cards")}
        </p>
        {type === "repeat_all" && newCardsCount ? (
          <p>
            {t("review_finished_want_more")}{" "}
            <span
              className={css({
                color: theme.linkColor,
              })}
              onClick={() => {
                screenStore.go({ type: "main" });
              }}
            >
              {newCardsCount} {translateNewCardsCount(newCardsCount)}
            </span>{" "}
            {t("review_finished_to_review")}
          </p>
        ) : (
          <p>{getEncouragingMessage()} 😊</p>
        )}
      </div>
    </DeckFinishedModal>
  );
});
