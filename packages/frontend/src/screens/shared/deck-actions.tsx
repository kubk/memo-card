import { CopyIcon, ShareIcon, TrashIcon } from "lucide-react";
import {
  type DeckListDeck,
  deckListStore,
} from "../../store/deck-list-store.ts";
import { userStore } from "../../store/user-store.ts";
import { t } from "../../translations/t.ts";
import { ButtonGrid } from "../../ui/button-grid.tsx";
import { ButtonSideAligned } from "../../ui/button-side-aligned.tsx";
import { Dropdown } from "../../ui/dropdown.tsx";
import { shareMemoCardUrl } from "./share-memo-card-url.tsx";

type Props = {
  deck: Pick<DeckListDeck, "authorId" | "id" | "shareId">;
  variant: "buttons" | "dropdown";
};

export function DeckActions(props: Props) {
  const { deck, variant } = props;
  const canDuplicate = deckListStore.canDuplicateDeck(deck);
  const canRemove = deckListStore.canRemoveDeck(deck);

  if (!canRemove) {
    return null;
  }

  const actions = [
    ...(canDuplicate
      ? [
          {
            key: "share",
            icon: ShareIcon,
            text: t("share"),
            onClick: () => {
              shareMemoCardUrl(deck.shareId);
            },
          },
          {
            key: "duplicate",
            icon: CopyIcon,
            text: t("duplicate"),
            onClick: () => {
              userStore.executeViaPaywall("duplicate_content", () => {
                deckListStore.onDuplicateDeck(deck.id);
              });
            },
          },
        ]
      : []),
    {
      key: "delete",
      icon: TrashIcon,
      text: t("delete"),
      onClick: () => {
        deckListStore.removeDeck(deck);
      },
    },
  ];

  if (variant === "dropdown") {
    return (
      <Dropdown
        className="relative mt-3 shrink-0"
        items={actions.map((action) => {
          const Icon = action.icon;
          const isDelete = action.key === "delete";
          return {
            icon: (
              <Icon
                size={20}
                className={isDelete ? "text-danger" : "text-hint"}
              />
            ),
            text: (
              <span className={isDelete ? "text-danger" : undefined}>
                {action.text}
              </span>
            ),
            onClick: action.onClick,
          };
        })}
      />
    );
  }

  return (
    <ButtonGrid>
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <ButtonSideAligned
            key={action.key}
            icon={<Icon size={24} />}
            outline
            onClick={action.onClick}
          >
            {action.text}
          </ButtonSideAligned>
        );
      })}
    </ButtonGrid>
  );
}
