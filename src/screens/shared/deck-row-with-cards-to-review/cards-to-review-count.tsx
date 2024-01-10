import { css } from "@emotion/css";
import React from "react";
import { observer } from "mobx-react-lite";

type Props = {
  items: Array<unknown>;
  color: string;
};

export const CardsToReviewCount = observer((props: Props) => {
  const { items, color } = props;

  return items.length > 0 ? (
    <div
      className={css({
        color: color,
        fontWeight: 600,
      })}
    >
      {items.length}
    </div>
  ) : null;
});
