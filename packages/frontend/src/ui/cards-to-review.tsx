import { DeckCardDbTypeWithType } from "../store/deck-list-store.ts";
import { Flex } from "./flex.tsx";
import { CardsToReviewCount } from "../screens/shared/deck-row-with-cards-to-review/cards-to-review-count.tsx";

type Props = {
  item: { cardsToReview: DeckCardDbTypeWithType[] };
};

export function CardsToReview(props: Props) {
  const { item } = props;
  return (
    <Flex mr={20} justifyContent={"space-between"} gap={10}>
      <CardsToReviewCount
        items={item.cardsToReview.filter((card) => card.type === "repeat")}
        className="text-orange"
      />
      <CardsToReviewCount
        items={item.cardsToReview.filter((card) => card.type === "new")}
        className="text-success"
      />
    </Flex>
  );
}
