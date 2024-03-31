import { observer } from "mobx-react-lite";
import { css } from "@emotion/css";
import { theme } from "./theme.tsx";
import LinesEllipsis from "react-lines-ellipsis";
import { DeckCategoryLogo } from "./deck-category-logo.tsx";
import { tapScale } from "../lib/animations/tap-scale.ts";
import React, { ReactNode } from "react";

type Props = {
  catalogItem: {
    id: number;
    name: string;
    description: string | null;
    available_in: string | null;
    deck_category?: { name: string; logo: string | null } | null;
  };
  onClick: () => void;
  titleRightSlot?: ReactNode;
};

export const DeckListItemWithDescription = observer((props: Props) => {
  const { catalogItem, onClick, titleRightSlot } = props;

  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        gap: 4,
        borderRadius: theme.borderRadius,
        padding: 12,
        cursor: "pointer",
        background: theme.secondaryBgColor,
        ...tapScale,
      })}
      onClick={onClick}
    >
      <div
        key={catalogItem.id}
        className={css({
          color: theme.textColor,
          fontWeight: 500,
          position: "relative",
        })}
      >
        {catalogItem.deck_category?.logo ? (
          <DeckCategoryLogo
            logo={catalogItem.deck_category.logo}
            categoryName={catalogItem.deck_category.name}
          />
        ) : null}
        {catalogItem.name}
        {titleRightSlot}
      </div>
      <div
        className={css({
          color: theme.hintColor,
          fontSize: 14,
        })}
      >
        <LinesEllipsis
          text={catalogItem.description}
          maxLine="2"
          ellipsis="..."
          trimRight
          basedOn="words"
        />
      </div>
    </div>
  );
});
