import React from "react";
import { observer } from "mobx-react-lite";
import { DeckFinishedModal } from "./deck-finished-modal.tsx";
import { useReviewStore } from "./store/review-store-context.tsx";
import { useMount } from "../../lib/react/use-mount.ts";
import { screenStore } from "../../store/screen-store.ts";
import { useMainButton } from "../../lib/telegram/use-main-button.tsx";
import { useTelegramProgress } from "../../lib/telegram/use-telegram-progress.tsx";
import { t } from "../../translations/t.ts";
import { getEncouragingMessage } from "../../translations/get-encouraging-message.tsx";
import { WantMoreCardsButton } from "./want-more-cards-button.tsx";
import { deckListStore } from "../../store/deck-list-store.ts";
import { Flex } from "../../ui/flex.tsx";

type Props = {
  type: "deck" | "repeat_all";
  newCardsCount?: number;
};

export const DeckFinished = observer((props: Props) => {
  const { type, newCardsCount } = props;
  const reviewStore = useReviewStore();

  useMount(() => {
    reviewStore.submitFinished(() => {
      deckListStore.load();
    });
  });
  useMainButton(t("go_back"), () => {
    screenStore.go({ type: "main" });
  });
  useTelegramProgress(() => reviewStore.isReviewSending);

  return (
    <DeckFinishedModal>
      <Flex direction={"column"} alignItems={"center"}>
        <p>
          {type === "deck" ? t("review_deck_finished") : t("review_all_cards")}
        </p>
        {type === "repeat_all" ? (
          <p>
            <WantMoreCardsButton newCardsCount={newCardsCount} />
          </p>
        ) : (
          <p>{getEncouragingMessage()} 😊</p>
        )}
      </Flex>
    </DeckFinishedModal>
  );
});
