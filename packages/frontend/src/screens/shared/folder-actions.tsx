import { LibraryItemActions } from "./library-item-actions.tsx";

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
  return <LibraryItemActions type="folder" target={folder} variant={variant} />;
}
