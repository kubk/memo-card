import { CopyIcon, ShareIcon, TrashIcon } from "lucide-react";
import { deckListStore } from "../../store/deck-list-store.ts";
import { userStore } from "../../store/user-store.ts";
import { t } from "../../translations/t.ts";
import { ButtonGrid } from "../../ui/button-grid.tsx";
import { ButtonSideAligned } from "../../ui/button-side-aligned.tsx";
import { Dropdown } from "../../ui/dropdown.tsx";
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

export function FolderActions(props: Props) {
  const { folder, variant } = props;
  const canSeeDuplicate = deckListStore.canSeeDuplicate(folder);
  const canRemove = deckListStore.canRemoveFolder(folder);

  if (!canRemove) {
    return null;
  }

  const onShare = () => {
    shareMemoCardUrl(folder.shareId);
  };

  const onDuplicate = () => {
    userStore.executeViaPaywall("duplicate_content", () => {
      deckListStore.onDuplicateFolder(folder.id);
    });
  };

  const onDelete = () => {
    const folderToRemove = deckListStore.searchFolderById(folder.id);
    if (folderToRemove) {
      deckListStore.deleteFolder(folderToRemove);
    }
  };

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
