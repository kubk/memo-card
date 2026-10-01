import { type DeckCardDbTypeWithType } from "../store/deck-list-store.ts";
import { Flex } from "./flex.tsx";
import { CardsToReviewCount } from "../screens/shared/deck-row-with-cards-to-review/cards-to-review-count.tsx";
import { type ActionTileRowItem } from "./action-tile.tsx";
import { t } from "../translations/t.ts";

type CardsToReviewItem = { cardsToReview: DeckCardDbTypeWithType[] };

export function getCardsToReviewCounts(item: CardsToReviewItem) {
  return {
    repeat: item.cardsToReview.filter((card) => card.type === "repeat").length,
    new: item.cardsToReview.filter((card) => card.type === "new").length,
  };
}

export function getCardsToReviewTileItems(
  item: CardsToReviewItem,
  isLoading: boolean,
  onStatClick: (cardType: "repeat" | "new") => void,
): ActionTileRowItem[] {
  const counts = getCardsToReviewCounts(item);

  return [
    {
      type: "stat",
      isLoading,
      value: counts.repeat,
      text: t("cards_to_repeat"),
      textClassName: "text-review-repeat",
      valueClassName: "text-review-repeat",
      onClick: () => onStatClick("repeat"),
    },
    {
      type: "stat",
      isLoading,
      value: counts.new,
      text: t("cards_new"),
      textClassName: "text-review-new",
      valueClassName: "text-review-new",
      onClick: () => onStatClick("new"),
    },
  ];
}

type Props = {
  item: CardsToReviewItem;
};

export function CardsToReview(props: Props) {
  const { item } = props;
  const counts = getCardsToReviewCounts(item);

  return (
    <Flex mr={20} justifyContent={"space-between"} gap={10}>
      <CardsToReviewCount
        items={counts.repeat}
        className="text-review-repeat"
      />
      <CardsToReviewCount items={counts.new} className="text-review-new" />
    </Flex>
  );
}
