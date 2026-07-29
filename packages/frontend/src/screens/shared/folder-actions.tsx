import { ShareIcon, TrashIcon } from "lucide-react";
import { deckListStore } from "../../store/deck-list-store.ts";
import { t } from "../../translations/t.ts";
import { ButtonGrid } from "../../ui/button-grid.tsx";
import { ButtonSideAligned } from "../../ui/button-side-aligned.tsx";
import { Dropdown } from "../../ui/dropdown.tsx";
import { deleteItemModalStore } from "./delete-item-modal-store.ts";
import { shareMemoCardUrl } from "./share-memo-card-url.tsx";

type FolderActionTarget = {
  authorId: number;
  id: number;
  shareId: string;
};

type Props = {
  folder: FolderActionTarget;
  variant: "buttons" | "dropdown";
};

export function FolderActions({ folder, variant }: Props) {
  const canShare = deckListStore.isFolderOwner(folder);
  const canRemove = deckListStore.canRemoveFolder(folder);

  if (!canRemove) {
    return null;
  }

  const onShare = () => {
    shareMemoCardUrl(folder.shareId);
  };

  const onDelete = () => {
    deleteItemModalStore.open({
      type: "folder",
      folderId: folder.id,
    });
  };

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
          {
            icon: <TrashIcon size={20} className="text-danger" />,
            text: <span className="text-danger">{t("delete")}</span>,
            onClick: onDelete,
          },
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
      <ButtonSideAligned
        icon={<TrashIcon size={24} />}
        outline
        onClick={onDelete}
      >
        {t("delete")}
      </ButtonSideAligned>
    </ButtonGrid>
  );
}
