import { CopyIcon, ShareIcon, TrashIcon } from "lucide-react";
import { deckListStore } from "../../store/deck-list-store.ts";
import { type DeckListDeck } from "../../store/routing/route-types.ts";
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
  const canSeeDuplicate = deckListStore.canSeeDuplicate(deck);
  const canRemove = deckListStore.canRemoveDeck(deck);

  const onShare = () => {
    shareMemoCardUrl(deck.shareId);
  };

  const onDuplicate = () => {
    userStore.executeViaPaywall("duplicate_content", () => {
      deckListStore.onDuplicateDeck(deck.id);
    });
  };

  const onDelete = () => {
    deckListStore.removeDeck(deck);
  };

  if (!canSeeDuplicate && !canRemove) {
    return null;
  }

  if (variant === "dropdown") {
    return (
      <Dropdown
        className="relative mt-3 shrink-0"
        items={[
          ...(canSeeDuplicate
            ? [
                {
                  icon: <ShareIcon size={20} className="text-hint" />,
                  text: t("share"),
                  onClick: onShare,
                },
                {
                  icon: <CopyIcon size={20} className="text-hint" />,
                  text: t("duplicate"),
                  onClick: onDuplicate,
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
      {canSeeDuplicate ? (
        <>
          <ButtonSideAligned
            icon={<ShareIcon size={24} />}
            outline
            onClick={onShare}
          >
            {t("share")}
          </ButtonSideAligned>
          <ButtonSideAligned
            icon={<CopyIcon size={24} />}
            outline
            onClick={onDuplicate}
          >
            {t("duplicate")}
          </ButtonSideAligned>
        </>
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
