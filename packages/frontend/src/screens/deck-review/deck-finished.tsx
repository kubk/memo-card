import { DeckFinishedModal } from "./deck-finished-modal.tsx";
import { useReviewStore } from "./store/review-store-context.tsx";
import { useMount } from "../../lib/react/use-mount.ts";
import { screenStore } from "../../store/screen-store.ts";
import { useMainButton } from "../../lib/platform/use-main-button.ts";
import { useProgress } from "../../lib/platform/use-progress.tsx";
import { t } from "../../translations/t.ts";
import { getEncouragingMessage } from "../../translations/get-encouraging-message.tsx";
import { WantMoreCardsButton } from "./want-more-cards-button.tsx";
import { deckListStore } from "../../store/deck-list-store.ts";
import { Flex } from "../../ui/flex.tsx";
import { useHotkeys } from "react-hotkeys-hook";

type Props = {
  type: "deck" | "repeat_all";
  newCardsCount?: number;
};

export function DeckFinished(props: Props) {
  const { type, newCardsCount } = props;
  const reviewStore = useReviewStore();

  useMount(() => {
    reviewStore.submitFinished(() => {
      deckListStore.load();
    });
  });

  const onBack = () => {
    screenStore.go({ type: "main" });
  };

  useHotkeys("enter", onBack);
  useMainButton(t("go_back"), onBack);
  useProgress(() => reviewStore.reviewCardsRequest.isLoading);

  return (
    <DeckFinishedModal>
      <Flex direction={"column"}>
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
}
