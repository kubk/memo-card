import {
  deckListStore,
  DeckWithCardsWithReviewType,
} from "../../store/deck-list-store.ts";
import { screenStore } from "../../store/screen-store.ts";
import { Hint } from "../../ui/hint.tsx";
import { useBackButton } from "../../lib/platform/use-back-button.ts";
import { useMainButton } from "../../lib/platform/use-main-button.ts";
import { ButtonSideAligned } from "../../ui/button-side-aligned.tsx";
import { useProgress } from "../../lib/platform/use-progress.tsx";
import { t } from "../../translations/t.ts";
import { useReviewStore } from "../deck-review/store/review-store-context.tsx";
import { ListHeader } from "../../ui/list-header.tsx";
import { ButtonGrid } from "../../ui/button-grid.tsx";
import { DeckFolderDescription } from "../shared/deck-folder-description.tsx";
import { useScrollToTopOnMount } from "../../lib/react/use-scroll-to-top-mount.ts";
import { Flex } from "../../ui/flex.tsx";
import { List } from "../../ui/list.tsx";
import { CardsToReview } from "../../ui/cards-to-review.tsx";
import { BrowserBackButton } from "../shared/browser-platform/browser-back-button.tsx";
import { useMount } from "../../lib/react/use-mount.ts";
import { platform } from "../../lib/platform/platform.ts";
import { BrowserPlatform } from "../../lib/platform/browser/browser-platform.ts";
import { cn } from "../../ui/cn.ts";
import { CardReviewStats } from "../shared/deck-stats/card-review-stats.tsx";
import { PencilIcon, PlusIcon, TrashIcon } from "lucide-react";

type Props = {
  onDeckPreviewOpen: (deck: DeckWithCardsWithReviewType) => void;
};

export function FolderPreview(props: Props) {
  const reviewStore = useReviewStore();

  useBackButton(() => {
    screenStore.back();
  });

  useMount(() => {
    deckListStore.checkFolderRequiresUpdating();
  });

  useProgress(() => deckListStore.isCatalogItemLoading);
  useScrollToTopOnMount();

  useMainButton(
    t("review_folder"),
    () => {
      deckListStore.reviewFolder(reviewStore);
    },
    () => deckListStore.isFolderReviewVisible,
    [],
    { forceHide: true },
  );

  const folder = deckListStore.selectedFolder;
  if (!folder) {
    return null;
  }

  const cardsTotal = folder.decks.reduce(
    (acc, cur) => cur.deckCards.length + acc,
    0,
  );

  return (
    <Flex direction={"column"} pb={82}>
      <ListHeader text={t("folder")} />
      <div className="flex flex-col gap-4 rounded-[12px] px-4 pb-4 pt-0 bg-bg">
        <div className="relative">
          <div className="absolute left-0 top-1.5">
            <BrowserBackButton />
          </div>
          <h3
            className={cn(
              "pt-3",
              platform instanceof BrowserPlatform ? "pl-8" : "pl-0",
            )}
          >
            {folder.name}
          </h3>
        </div>
        <div>
          <DeckFolderDescription deck={folder} />
        </div>
        <CardReviewStats
          isLoading={deckListStore.getFolderWithDecksCards.isLoading}
          newCardsCount={
            folder.cardsToReview.filter((card) => card.type === "new").length
          }
          repeatCardsCount={
            folder.cardsToReview.filter((card) => card.type === "repeat").length
          }
          totalCardsCount={cardsTotal}
        />

        <ButtonGrid>
          {deckListStore.canEditFolder ? (
            <>
              <ButtonSideAligned
                icon={<PlusIcon size={24} />}
                outline
                onClick={() => {
                  screenStore.goToDeckForm({
                    folder: {
                      id: folder.id,
                      name: folder.name,
                    },
                  });
                }}
              >
                {t("add_deck_short")}
              </ButtonSideAligned>
              <ButtonSideAligned
                icon={<PencilIcon size={24} />}
                outline
                onClick={() => {
                  screenStore.go({ type: "folderForm", folderId: folder.id });
                }}
              >
                {t("edit")}
              </ButtonSideAligned>
            </>
          ) : (
            <>
              {deckListStore.myFoldersIds.includes(folder.id) && (
                <ButtonSideAligned
                  icon={<TrashIcon size={24} />}
                  outline
                  onClick={() => {
                    const folderToRemove = deckListStore.searchFolderById(
                      folder.id,
                    );
                    if (folderToRemove) {
                      deckListStore.deleteFolder(folderToRemove);
                    }
                  }}
                >
                  {t("delete")}
                </ButtonSideAligned>
              )}
            </>
          )}
        </ButtonGrid>
      </div>

      {folder.decks.length > 0 && (
        <Flex pt={6} direction={"column"} gap={8}>
          <div>
            <ListHeader text={t("decks")} />
            <List
              items={folder.decks.map((deck) => ({
                onClick: () => {
                  const found = deckListStore.goDeckById(deck.id);
                  if (!found) {
                    props.onDeckPreviewOpen(deck);
                  }
                },
                text: deck.name,
                right: (
                  <div className="relative -mr-3">
                    <CardsToReview item={deck} />
                  </div>
                ),
              }))}
            />
          </div>
        </Flex>
      )}

      {cardsTotal > 0 &&
      deckListStore.isDeckFolderAdded({ id: folder.id, type: "folder" })
        .isMineFolder &&
      folder.cardsToReview.length === 0 &&
      !deckListStore.isCatalogItemLoading ? (
        <div className="mt-2">
          <Hint>{t("no_cards_to_review_in_deck")}</Hint>
        </div>
      ) : null}
    </Flex>
  );
}
