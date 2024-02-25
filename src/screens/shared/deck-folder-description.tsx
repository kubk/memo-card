import React, { useState } from "react";
import { useIsOverflowing } from "../../lib/react/use-is-overflowing.ts";
import { css, cx } from "@emotion/css";
import { theme } from "../../ui/theme.tsx";
import { t } from "../../translations/t.ts";

type Props = {
  deck: { description: string | null };
};

export const DeckFolderDescription = (props: Props) => {
  const { deck } = props;
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { ref } = useIsOverflowing(isOverflowing, setIsOverflowing);

  return (
    <>
      <div
        ref={ref}
        className={cx(
          css({
            whiteSpace: "pre-wrap",
            maxHeight: 294,
            overflowY: "hidden",
          }),
          isExpanded && css({ maxHeight: "none" }),
        )}
      >
        {deck.description}
      </div>
      {isOverflowing && !isExpanded ? (
        <div
          className={css({
            color: theme.linkColor,
            textAlign: "center",
            cursor: "pointer",
          })}
          onClick={() => {
            setIsExpanded(true);
          }}
        >
          {t("read_more")}
        </div>
      ) : null}
    </>
  );
};
