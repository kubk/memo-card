import { useState } from "react";
import { useIsOverflowing } from "../../lib/react/use-is-overflowing.ts";
import { cn } from "../../ui/cn.ts";
import { t } from "../../translations/t.ts";
import { sanitizeTextForCard } from "../../lib/sanitize-html/sanitize-text-for-card.ts";
import { wysiwygTableStyle } from "../../ui/wysiwyg-table-style.ts";

type Props = {
  deck: { description: string | null };
  isExpanded?: boolean;
};

export function DeckFolderDescription(props: Props) {
  const { deck } = props;
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(!!props.isExpanded);
  const { ref } = useIsOverflowing(isOverflowing, setIsOverflowing);

  return (
    <>
      <div
        ref={ref}
        className={cn(
          "whitespace-pre-wrap max-h-[294px] overflow-y-hidden",
          isExpanded && "max-h-none",
          wysiwygTableStyle,
        )}
        dangerouslySetInnerHTML={{
          __html: sanitizeTextForCard(deck.description || ""),
        }}
      />
      {isOverflowing && !isExpanded ? (
        <div
          className="text-link text-center cursor-pointer"
          onClick={() => {
            setIsExpanded(true);
          }}
        >
          {t("read_more")}
        </div>
      ) : null}
    </>
  );
}
