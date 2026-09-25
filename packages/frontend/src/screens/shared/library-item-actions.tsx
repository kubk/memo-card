import { ShareIcon, TrashIcon } from "lucide-react";
import { deckListStore } from "../../store/deck-list-store.ts";
import { type DeckListDeck } from "../../store/deck-types.ts";
import { t } from "../../translations/t.ts";
import { ButtonGrid } from "../../ui/button-grid.tsx";
import { Button } from "../../ui/button.tsx";
import { DropdownOrVault } from "../../ui/dropdown-or-vault.tsx";
import { deleteItemModalStore } from "./delete-item-modal-store.ts";
import { shareMemoCardUrl } from "./share-memo-card-url.tsx";

type DeckActionTarget = Pick<DeckListDeck, "authorId" | "id" | "shareId">;

type FolderActionTarget = {
  authorId: number;
  id: number;
  shareId: string;
};

type Props = {
  variant: "buttons" | "dropdown";
} & (
  | { type: "deck"; target: DeckActionTarget }
  | { type: "folder"; target: FolderActionTarget }
);

export function LibraryItemActions(props: Props) {
  const { target, variant } = props;
  const canShare =
    props.type === "deck"
      ? deckListStore.isDeckOwner(props.target)
      : deckListStore.isFolderOwner(props.target);
  const canRemove =
    props.type === "deck"
      ? deckListStore.canRemoveDeck(target)
      : deckListStore.canRemoveFolder(target);

  if (
    (props.type === "deck" && !canShare && !canRemove) ||
    (props.type === "folder" && !canRemove)
  ) {
    return null;
  }

  const onShare = () => {
    shareMemoCardUrl(target.shareId);
  };

  const onDelete = () => {
    deleteItemModalStore.open(
      props.type === "deck"
        ? { type: "deck", deckId: target.id }
        : { type: "folder", folderId: target.id },
    );
  };

  const actions = [
    ...(canShare ? [{ type: "share" as const, onClick: onShare }] : []),
    ...(canRemove ? [{ type: "delete" as const, onClick: onDelete }] : []),
  ];

  if (variant === "dropdown") {
    return (
      <DropdownOrVault
        className="relative mt-3 shrink-0"
        options={actions.map((action) => ({
          icon:
            action.type === "share" ? (
              <ShareIcon size={20} className="text-hint" />
            ) : (
              <TrashIcon size={20} className="text-danger" />
            ),
          text:
            action.type === "share" ? (
              t("share")
            ) : (
              <span className="text-danger">{t("delete")}</span>
            ),
          onClick: action.onClick,
        }))}
      />
    );
  }

  return (
    <ButtonGrid>
      {actions.map((action) => (
        <Button
          align="left"
          key={action.type}
          icon={
            action.type === "share" ? (
              <ShareIcon size={24} />
            ) : (
              <TrashIcon size={24} />
            )
          }
          onClick={action.onClick}
        >
          {t(action.type === "share" ? "share" : "delete")}
        </Button>
      ))}
    </ButtonGrid>
  );
}
