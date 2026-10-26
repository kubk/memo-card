import { deckListStore } from "../../store/deck-list-store.ts";
import { screenStore } from "../../store/screen-store.ts";
import { copyItemModalStore } from "./copy-item-modal-store.ts";
import { type ActionTileRowItem } from "../../ui/action-tile.tsx";
import {
  getItemTileActions,
  LibraryItemActions,
} from "./library-item-actions.tsx";

type FolderActionTarget = {
  authorId: number;
  id: number;
  shareId: string;
};

export function getFolderTileActions(
  folder: FolderActionTarget & { isPublic: boolean },
  canEdit: boolean,
): ActionTileRowItem | null {
  return getItemTileActions({
    type: "folder",
    target: folder,
    onEdit: canEdit
      ? () => {
          screenStore.push({ type: "folderForm", folderId: folder.id });
        }
      : folder.isPublic && deckListStore.canRemoveFolder(folder)
        ? () => {
            copyItemModalStore.open({ type: "folder", folderId: folder.id });
          }
        : undefined,
  });
}

export function FolderActions({
  folder,
  className,
}: {
  folder: FolderActionTarget;
  className?: string;
}) {
  return (
    <LibraryItemActions type="folder" target={folder} className={className} />
  );
}
