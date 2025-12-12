import LinesEllipsis from "react-lines-ellipsis";
import { DeckCategoryLogo } from "./deck-category-logo.tsx";
import { ReactNode } from "react";
import { removeAllTags } from "../lib/sanitize-html/remove-all-tags.ts";

type Props = {
  catalogItem: {
    id: number;
    name: string;
    description: string | null;
    availableIn: string | null;
    deckCategory?: { name: string; logo: string | null } | null;
  };
  onClick: () => void;
  titleRightSlot?: ReactNode;
};

export function DeckListItemWithDescription(props: Props) {
  const { catalogItem, onClick, titleRightSlot } = props;

  return (
    <div
      className="flex flex-col gap-1 rounded-[12px] p-3 cursor-pointer bg-bg"
      onClick={onClick}
    >
      <div key={catalogItem.id} className="text-text font-medium relative">
        {catalogItem.deckCategory?.logo ? (
          <DeckCategoryLogo
            logo={catalogItem.deckCategory.logo}
            categoryName={catalogItem.deckCategory.name}
          />
        ) : null}{" "}
        {catalogItem.name}
        {titleRightSlot}
      </div>
      <div className="text-hint text-[14px]">
        <LinesEllipsis
          text={
            catalogItem.description
              ? removeAllTags({ text: catalogItem.description })
              : ""
          }
          maxLine="2"
          ellipsis="..."
          trimRight
          basedOn="words"
        />
      </div>
    </div>
  );
}
