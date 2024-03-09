import { observer } from "mobx-react-lite";
import { css } from "@emotion/css";
import { theme } from "../../../ui/theme.tsx";
import React from "react";
import { DeckCardDbTypeWithType } from "../../../store/deck-list-store.ts";
import { CardsToReviewCount } from "./cards-to-review-count.tsx";
import { tapScale } from "../../../lib/animations/tap-scale.ts";
import { Flex } from "../../../ui/flex.tsx";

type Props = {
  item: {
    id: number;
    cardsToReview: DeckCardDbTypeWithType[];
    name: string;
  };
  onClick: () => void;
};

export const DeckRowWithCardsToReview = observer((props: Props) => {
  const { item, onClick } = props;

  return (
    <div
      onClick={onClick}
      className={css({
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        cursor: "pointer",
        gap: 4,
        borderRadius: theme.borderRadius,
        padding: 12,
        background: theme.secondaryBgColor,
        ...tapScale,
      })}
    >
      <div
        key={item.id}
        className={css({
          color: theme.textColor,
          fontWeight: 500,
        })}
      >
        {item.name}
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
});
