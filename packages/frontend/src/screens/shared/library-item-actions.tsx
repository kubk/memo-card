import {
  EllipsisIcon,
  LinkIcon,
  PencilIcon,
  ShareIcon,
  TrashIcon,
} from "lucide-react";
import { deckListStore } from "../../store/deck-list-store.ts";
import { type DeckListDeck } from "../../store/deck-types.ts";
import { t } from "../../translations/t.ts";
import { type ActionTileRowItem } from "../../ui/action-tile.tsx";
import { ButtonGrid } from "../../ui/button-grid.tsx";
import { Button } from "../../ui/button.tsx";
import { type DropdownItem } from "../../ui/dropdown.tsx";
import { DropdownOrVault } from "../../ui/dropdown-or-vault.tsx";
import { deleteItemModalStore } from "./delete-item-modal-store.ts";
import {
  canShareMessage,
  copyMemoCardLink,
  shareMemoCardUrl,
} from "./share-memo-card-url.tsx";

type DeckActionTarget = Pick<DeckListDeck, "authorId" | "id" | "shareId">;

type FolderActionTarget = {
  authorId: number;
  id: number;
  shareId: string;
};

type TargetProps =
  | { type: "deck"; target: DeckActionTarget }
  | { type: "folder"; target: FolderActionTarget };

type Props = TargetProps & {
  variant: "buttons" | "dropdown";
  onEdit?: () => void;
};

function getTargetActions(props: TargetProps) {
  const { target } = props;
  const canShare =
    props.type === "deck"
      ? deckListStore.isDeckOwner(props.target)
      : deckListStore.isFolderOwner(props.target);
  const canRemove =
    props.type === "deck"
      ? deckListStore.canRemoveDeck(target)
      : deckListStore.canRemoveFolder(target);

  const actions = [
    ...(canShare
      ? [
          {
            type: "share" as const,
            Icon: ShareIcon,
            text: t("share"),
            onClick: () => {
              shareMemoCardUrl({
                type: props.type,
                id: target.id,
                shareId: target.shareId,
              });
            },
          },
          ...(canShareMessage()
            ? [
                {
                  type: "link" as const,
                  Icon: LinkIcon,
                  text: t("share_link"),
                  onClick: () => {
                    copyMemoCardLink(target.shareId);
                  },
                },
              ]
            : []),
        ]
      : []),
    ...(canRemove
      ? [
          {
            type: "delete" as const,
            Icon: TrashIcon,
            text: t("delete"),
            onClick: () => {
              deleteItemModalStore.open(
                props.type === "deck"
                  ? { type: "deck", deckId: target.id }
                  : { type: "folder", folderId: target.id },
              );
            },
          },
        ]
      : []),
  ];

  return { canShare, canRemove, actions };
}

function getLibraryItemActions({
  onEdit,
  ...props
}: TargetProps & { onEdit?: () => void }): DropdownItem[] {
  const { actions } = getTargetActions(props);

  return [
    ...(onEdit
      ? [
          {
            icon: <PencilIcon size={20} className="text-hint" />,
            text: t("edit"),
            onClick: onEdit,
          },
        ]
      : []),
    ...actions.map((action) => ({
      icon: (
        <action.Icon
          size={20}
          className={action.type === "delete" ? "text-danger" : "text-hint"}
        />
      ),
      text:
        action.type === "delete" ? (
          <span className="text-danger">{action.text}</span>
        ) : (
          action.text
        ),
      onClick: action.onClick,
    })),
  ];
}

export function getItemTileActions(
  props: TargetProps & { onEdit?: () => void },
): ActionTileRowItem | null {
  const options = getLibraryItemActions(props);

  if (options.length === 0) {
    return null;
  }

  return {
    type: "dropdown",
    icon: <EllipsisIcon size={24} />,
    text: t("more"),
    options,
  };
}

export function LibraryItemActions(props: Props) {
  const { variant } = props;
  const { canShare, canRemove, actions } = getTargetActions(props);

  if (
    (props.type === "deck" && !canShare && !canRemove) ||
    (props.type === "folder" && !canRemove)
  ) {
    return null;
  }

  if (variant === "dropdown") {
    return (
      <DropdownOrVault
        className="relative mt-3 shrink-0"
        options={getLibraryItemActions(props)}
      />
    );
  }

  return (
    <ButtonGrid>
      {actions.map((action) => (
        <Button
          align="left"
          key={action.type}
          icon={<action.Icon size={24} />}
          onClick={action.onClick}
        >
          {action.text}
        </Button>
      ))}
    </ButtonGrid>
  );
}
