import { observer } from "mobx-react-lite";
import { deckListStore } from "../../store/deck-list-store.ts";
import { css } from "@emotion/css";
import { theme } from "../../ui/theme.tsx";
import React from "react";
import { screenStore } from "../../store/screen-store.ts";
import { Hint } from "../../ui/hint.tsx";
import { useBackButton } from "../../lib/telegram/use-back-button.tsx";
import { useMainButton } from "../../lib/telegram/use-main-button.tsx";
import { showConfirm } from "../../lib/telegram/show-confirm.ts";
import { ButtonSideAligned } from "../../ui/button-side-aligned.tsx";
import { useTelegramProgress } from "../../lib/telegram/use-telegram-progress.tsx";
import { t } from "../../translations/t.ts";
import { useReviewStore } from "../deck-review/store/review-store-context.tsx";
import { ListHeader } from "../../ui/list-header.tsx";
import { assert } from "../../lib/typescript/assert.ts";
import { DeckRowWithCardsToReview } from "../shared/deck-row-with-cards-to-review/deck-row-with-cards-to-review.tsx";
import { ButtonGrid } from "../../ui/button-grid.tsx";
import { DeckFolderDescription } from "../shared/deck-folder-description.tsx";
import { useScrollToTopOnMount } from "../../lib/react/use-scroll-to-top-mount.ts";
import { redirectUserToDeckOrFolderLink } from "../share-deck/redirect-user-to-deck-or-folder-link.tsx";
import { userStore } from "../../store/user-store.ts";
import { Flex } from "../../ui/flex.tsx";

export const FolderPreview = observer(() => {
  const reviewStore = useReviewStore();

  useBackButton(() => {
    screenStore.go({ type: "main" });
  });

  useTelegramProgress(() => deckListStore.isDeckCardsLoading);
  useScrollToTopOnMount();

  useMainButton(
    t("review_folder"),
    () => {
      const folder = deckListStore.selectedFolder;
      assert(folder, "Folder should be selected before review");
      reviewStore.startFolderReview(folder.decks);
    },
    () => deckListStore.isFolderReviewVisible,
  );

  const folder = deckListStore.selectedFolder;
  if (!folder) {
    return null;
  }

  return (
    <Flex direction={"column"} pt={12} pb={12}>
      <div
        className={css({
          display: "flex",
          flexDirection: "column",
          gap: 16,
          borderRadius: theme.borderRadius,
          padding: "8px 16px",
          paddingBottom: 12,
          background: theme.secondaryBgColor,
        })}
      >
        <div
          className={css({
            position: "relative",
            textAlign: "center",
          })}
        >
          <h3
            className={css({
              paddingTop: 12,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 6,
            })}
          >
            <i className={"mdi mdi-folder-open-outline"} title={t("folder")} />
            {folder.name}
          </h3>
        </div>
        <div>
          <DeckFolderDescription deck={folder} />
        </div>
        {!deckListStore.isDeckCardsLoading && (
          <div
            className={css({
              display: "flex",
              gap: 4,
              flexDirection: "column",
              borderTop: `1px solid ${theme.dividerColor}`,
              paddingTop: 8,
            })}
          >
            <Flex gap={4}>
              <span>{t("cards_to_repeat")}: </span>
              <h4 className={css({ color: theme.orange })}>
                {
                  folder.cardsToReview.filter((card) => card.type === "repeat")
                    .length
                }
              </h4>
            </Flex>
            <Flex gap={4}>
              <span>{t("cards_new")}: </span>
              <h4 className={css({ color: theme.success })}>
                {
                  folder.cardsToReview.filter((card) => card.type === "new")
                    .length
                }
              </h4>
            </Flex>
            <Flex gap={4}>
              <span>{t("cards_total")}: </span>
              <h4>
                {folder.decks.reduce(
                  (acc, cur) => cur.deck_card.length + acc,
                  0,
                )}
              </h4>
            </Flex>
          </div>
        )}

        <ButtonGrid>
          {deckListStore.canEditFolder ? (
            <ButtonSideAligned
              icon={"mdi-plus-circle mdi-24px"}
              outline
              onClick={() => {
                screenStore.go({
                  type: "deckForm",
                  folder: {
                    id: folder.id,
                    name: folder.name,
                  },
                });
              }}
            >
              {t("add_deck_short")}
            </ButtonSideAligned>
          ) : null}
          {deckListStore.canDuplicateSelectedFolder && (
            <ButtonSideAligned
              icon={"mdi-content-duplicate mdi-24px"}
              outline
              onClick={() => {
                deckListStore.onDuplicateFolder(folder.id);
              }}
            >
              {t("duplicate")}
            </ButtonSideAligned>
          )}
          {deckListStore.canEditFolder ? (
            <ButtonSideAligned
              icon={"mdi-pencil-circle mdi-24px"}
              outline
              onClick={() => {
                screenStore.go({ type: "folderForm", folderId: folder.id });
              }}
            >
              {t("edit")}
            </ButtonSideAligned>
          ) : null}
          {deckListStore.canEditFolder && (
            <ButtonSideAligned
              icon={"mdi-share-circle mdi-24px"}
              outline
              onClick={() => {
                if (userStore.canAdvancedShare) {
                  screenStore.go({
                    type: "shareFolder",
                    folderId: folder.id,
                    shareId: folder.shareId,
                  });
                } else {
                  redirectUserToDeckOrFolderLink(folder.shareId);
                }
              }}
            >
              {t("share")}
            </ButtonSideAligned>
          )}
          <ButtonSideAligned
            icon={"mdi-delete-circle mdi-24px"}
            outline
            onClick={async () => {
              const isConfirmed = await showConfirm(t("delete_folder_confirm"));
              if (isConfirmed) {
                deckListStore.deleteFolder();
              }
            }}
          >
            {t("delete")}
          </ButtonSideAligned>
        </ButtonGrid>
      </div>
      <Flex pt={6} direction={"column"} gap={6}>
        <ListHeader text={t("decks")} />
        {folder.decks.map((deck, i) => {
          return (
            <DeckRowWithCardsToReview
              key={i}
              item={deck}
              onClick={() => {
                deckListStore.goDeckById(deck.id);
              }}
            />
          );
        })}
        {folder.cardsToReview.length === 0 && (
          <Hint>{t("no_cards_to_review_in_deck")}</Hint>
        )}
      </Flex>
    </Flex>
  );
});
