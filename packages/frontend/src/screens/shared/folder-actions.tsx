import { screenStore } from "../../store/screen-store.ts";
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
  folder: FolderActionTarget,
  canEdit: boolean,
): ActionTileRowItem | null {
  return getItemTileActions({
    type: "folder",
    target: folder,
    onEdit: canEdit
      ? () => {
          screenStore.push({ type: "folderForm", folderId: folder.id });
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
