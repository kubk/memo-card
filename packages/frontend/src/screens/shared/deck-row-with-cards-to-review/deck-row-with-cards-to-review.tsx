import { theme } from "../../../ui/theme.tsx";
import { DeckCardDbTypeWithType } from "../../../store/deck-list-store.ts";
import { CardsToReviewCount } from "./cards-to-review-count.tsx";
import { Flex } from "../../../ui/flex.tsx";
import { ReactNode } from "react";

type Props = {
  item: {
    id: number;
    cardsToReview: DeckCardDbTypeWithType[];
    name: string;
  };
  slotLeft?: ReactNode;
  onClick: () => void;
};

export function DeckRowWithCardsToReview(props: Props) {
  const { item, onClick, slotLeft } = props;

  return (
    <div
      onClick={onClick}
      className="flex justify-between items-center cursor-pointer gap-1 rounded-[12px] p-3 bg-bg"
    >
      <div className={"flex"} key={item.id}>
        {slotLeft}
        <div className="text-text font-medium">{item.name}</div>
      </div>
      <Flex justifyContent={"space-between"} gap={10}>
        <CardsToReviewCount
          items={item.cardsToReview.filter((card) => card.type === "repeat")}
          color={theme.orange}
        />
        <CardsToReviewCount
          items={item.cardsToReview.filter((card) => card.type === "new")}
          color={theme.success}
        />
      </Flex>
    </div>
  );
}
