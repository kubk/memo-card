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
import { ButtonGrid } from "../../ui/button-grid.tsx";
import { DeckFolderDescription } from "../shared/deck-folder-description.tsx";
import { useScrollToTopOnMount } from "../../lib/react/use-scroll-to-top-mount.ts";
import { redirectUserToDeckOrFolderLink } from "../share-deck/redirect-user-to-deck-or-folder-link.tsx";
import { userStore } from "../../store/user-store.ts";
import { Flex } from "../../ui/flex.tsx";
import { List } from "../../ui/list.tsx";
import { CardsToReview } from "../../ui/cards-to-review.tsx";

export const FolderPreview = observer(() => {
  const reviewStore = useReviewStore();

  useBackButton(() => {
    screenStore.back();
  });

  useTelegramProgress(() => deckListStore.isCatalogItemLoading);
  useScrollToTopOnMount();

  useMainButton(
    t("review_folder"),
    () => {
      deckListStore.reviewFolder(reviewStore);
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
          paddingBottom: 16,
          background: theme.bgColor,
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
        {!deckListStore.getFolderWithDecksCards.isLoading && (
          <div
            className={css({
              display: "flex",
              gap: 4,
              flexDirection: "column",
              borderTop: `1px solid ${theme.divider}`,
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
          {deckListStore.canEditFolder && (
            <>
              <ButtonSideAligned
                icon={"mdi-pencil-circle mdi-24px"}
                outline
                onClick={() => {
                  screenStore.go({ type: "folderForm", folderId: folder.id });
                }}
              >
                {t("edit")}
              </ButtonSideAligned>
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
              <ButtonSideAligned
                icon={"mdi-delete-circle mdi-24px"}
                outline
                onClick={async () => {
                  const isConfirmed = await showConfirm(
                    t("delete_folder_confirm"),
                  );
                  if (isConfirmed) {
                    deckListStore.deleteFolder();
                  }
                }}
              >
                {t("delete")}
              </ButtonSideAligned>
            </>
          )}
        </ButtonGrid>
      </div>
      <Flex pt={6} direction={"column"}>
        <ListHeader text={t("decks")} />
        <List
          items={folder.decks.map((deck) => ({
            onClick: () => {
              deckListStore.goDeckById(deck.id);
            },
            text: deck.name,
            right: <CardsToReview item={deck} />,
          }))}
        />
        {folder.cardsToReview.length === 0 &&
        !deckListStore.isCatalogItemLoading ? (
          <Hint>{t("no_cards_to_review_in_deck")}</Hint>
        ) : null}
      </Flex>
    </Flex>
  );
});
