import { ShareIcon, TrashIcon } from "lucide-react";
import { deckListStore } from "../../store/deck-list-store.ts";
import { type DeckListDeck } from "../../store/deck-types.ts";
import { t } from "../../translations/t.ts";
import { ButtonGrid } from "../../ui/button-grid.tsx";
import { ButtonSideAligned } from "../../ui/button-side-aligned.tsx";
import { Dropdown } from "../../ui/dropdown.tsx";
import { shareMemoCardUrl } from "./share-memo-card-url.tsx";

type Props = {
  deck: Pick<DeckListDeck, "authorId" | "id" | "shareId">;
  variant: "buttons" | "dropdown";
};

export function DeckActions({ deck, variant }: Props) {
  const canShare = deckListStore.isDeckOwner(deck);
  const canRemove = deckListStore.canRemoveDeck(deck);

  const onShare = () => {
    shareMemoCardUrl(deck.shareId);
  };

  const onDelete = () => {
    deckListStore.removeDeck(deck);
  };

  if (!canShare && !canRemove) {
    return null;
  }

  if (variant === "dropdown") {
    return (
      <Dropdown
        className="relative mt-3 shrink-0"
        items={[
          ...(canShare
            ? [
                {
                  icon: <ShareIcon size={20} className="text-hint" />,
                  text: t("share"),
                  onClick: onShare,
                },
              ]
            : []),
          ...(canRemove
            ? [
                {
                  icon: <TrashIcon size={20} className="text-danger" />,
                  text: <span className="text-danger">{t("delete")}</span>,
                  onClick: onDelete,
                },
              ]
            : []),
        ]}
      />
    );
  }

  return (
    <ButtonGrid>
      {canShare ? (
        <ButtonSideAligned
          icon={<ShareIcon size={24} />}
          outline
          onClick={onShare}
        >
          {t("share")}
        </ButtonSideAligned>
      ) : null}
      {canRemove ? (
        <ButtonSideAligned
          icon={<TrashIcon size={24} />}
          outline
          onClick={onDelete}
        >
          {t("delete")}
        </ButtonSideAligned>
      ) : null}
    </ButtonGrid>
  );
}
