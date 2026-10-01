import { deckListStore } from "../../store/deck-list-store.ts";
import { screenStore } from "../../store/screen-store.ts";
import { Hint } from "../../ui/hint.tsx";
import { useBackButton } from "../../lib/platform/use-back-button.ts";
import { useMainButton } from "../../lib/platform/use-main-button.ts";
import { useProgress } from "../../lib/platform/use-progress.tsx";
import { t } from "../../translations/t.ts";
import { useReviewStore } from "../deck-review/store/review-store-context.tsx";
import { LabelGroup } from "../../ui/label-group.tsx";
import { DeckFolderDescription } from "../shared/deck-folder-description.tsx";
import { Flex } from "../../ui/flex.tsx";
import { List } from "../../ui/list.tsx";
import { CardsToReview } from "../../ui/cards-to-review.tsx";
import { BrowserBackButton } from "../shared/browser-platform/browser-back-button.tsx";
import { cn } from "../../ui/cn.ts";
import {
  ActionTileRow,
  type ActionTileRowItem,
} from "../../ui/action-tile.tsx";
import { PlusIcon } from "lucide-react";
import { type FolderScreenStore } from "./store/folder-screen-store.ts";
import { ErrorScreen } from "../error-screen/error-screen.tsx";
import { getFolderTileActions } from "../shared/folder-actions.tsx";
import { getCardsToReviewTileItems } from "../../ui/cards-to-review.tsx";

type Props = {
  store: FolderScreenStore;
};

export function FolderPreview(props: Props) {
  const reviewStore = useReviewStore();
  const { store } = props;

  useBackButton(() => {
    screenStore.back();
  });

  useProgress(() => store.isInitialLoading);

  useMainButton(
    t("review_folder"),
    () => {
      store.startReview(reviewStore);
    },
    () => store.isReviewVisible,
  );

  if (store.detailsQuery.error) {
    return <ErrorScreen />;
  }

  const folder = store.folder;
  if (!folder) {
    return null;
  }

  const cardsTotal = folder.decks.reduce(
    (acc, cur) => cur.deckCards.length + acc,
    0,
  );

  const folderTileActions = getFolderTileActions(folder, store.canEdit);

  const items: ActionTileRowItem[] = [
    ...(store.canEdit
      ? [
          {
            type: "action" as const,
            icon: <PlusIcon size={24} />,
            text: t("add_deck_short"),
            onClick: () => {
              screenStore.push({
                type: "deckForm",
                folderId: folder.id,
                folderName: folder.name,
              });
            },
          },
        ]
      : []),
    ...getCardsToReviewTileItems(folder, store.isInitialLoading),
    ...(folderTileActions ? [folderTileActions] : []),
  ];

  return (
    <Flex direction={"column"} pb={82}>
      <LabelGroup title={t("folder")}>
        <div className="flex flex-col gap-4 rounded-[12px] px-4 pb-4 pt-0 bg-bg">
          <div className={cn("flex items-start gap-1.5")}>
            <BrowserBackButton className="mt-3" />
            <h3 className={cn("min-w-0 flex-1 pt-3")}>{folder.name}</h3>
          </div>
          <div>
            <DeckFolderDescription deck={folder} />
          </div>
        </div>
      </LabelGroup>

      <ActionTileRow className="mt-2" items={items} />

      {folder.decks.length > 0 && (
        <Flex pt={16} direction={"column"} gap={8}>
          <LabelGroup title={t("decks")}>
            <List
              items={folder.decks.map((deck) => ({
                onClick: () => {
                  screenStore.push({
                    type: "deckPreview",
                    deckId: deck.id,
                  });
                },
                text: deck.name,
                right: (
                  <div className="relative -mr-3">
                    <CardsToReview item={deck} />
                  </div>
                ),
              }))}
            />
          </LabelGroup>
        </Flex>
      )}

      {cardsTotal > 0 &&
      deckListStore.isItemAdded({ id: folder.id, type: "folder" }) &&
      folder.cardsToReview.length === 0 &&
      !store.isInitialLoading ? (
        <div className="mt-2">
          <Hint>{t("no_cards_to_review_in_deck")}</Hint>
        </div>
      ) : null}
    </Flex>
  );
}
