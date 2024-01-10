import React, { Fragment } from "react";
import { observer } from "mobx-react-lite";
import { css, cx } from "@emotion/css";
import { PublicDeck } from "./public-deck.tsx";
import { DeckRowWithCardsToReview } from "../shared/deck-row-with-cards-to-review/deck-row-with-cards-to-review.tsx";
import { deckListStore } from "../../store/deck-list-store.ts";
import { useMount } from "../../lib/react/use-mount.ts";
import { Hint } from "../../ui/hint.tsx";
import { theme } from "../../ui/theme.tsx";
import { screenStore } from "../../store/screen-store.ts";
import { Button } from "../../ui/button.tsx";
import { DeckLoading } from "../shared/deck-loading.tsx";
import WebApp from "@twa-dev/sdk";
import { ListHeader } from "../../ui/list-header.tsx";
import { range } from "../../lib/array/range.ts";
import { reset } from "../../ui/reset.ts";
import { ViewMoreDecksToggle } from "./view-more-decks-toggle.tsx";
import { t } from "../../translations/t.ts";
import { links } from "../shared/links.ts";

export const MainScreen = observer(() => {
  useMount(() => {
    deckListStore.loadFirstTime(WebApp.initDataUnsafe.start_param);
  });

  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        gap: 12,
        paddingBottom: 16,
      })}
    >
      <div>
        <ListHeader
          text={t("my_decks")}
          rightSlot={
            deckListStore.shouldShowMyDecksToggle ? (
              <ViewMoreDecksToggle />
            ) : undefined
          }
        />
        <div
          className={css({
            display: "flex",
            flexDirection: "column",
            gap: 6,
          })}
        >
          {deckListStore.isMyInfoLoading &&
            range(deckListStore.skeletonLoaderData.myDecksCount).map((i) => (
              <DeckLoading key={i} />
            ))}
          {deckListStore.myInfo
            ? deckListStore.myDeckItemsVisible.map((listItem) => {
                return (
                  <Fragment key={listItem.id}>
                    <DeckRowWithCardsToReview
                      onClick={() => {
                        if (listItem.type === "deck") {
                          screenStore.go({
                            type: "deckMine",
                            deckId: listItem.id,
                          });
                        }
                        if (listItem.type === "folder") {
                          screenStore.go({
                            type: "folderPreview",
                            folderId: listItem.id,
                          });
                        }
                      }}
                      item={listItem}
                    />
                    {listItem.type === "folder" &&
                    deckListStore.isMyDecksExpanded.value
                      ? listItem.decks.map((deck) => {
                          return (
                            <div className={css({ marginLeft: 24 })}>
                              <DeckRowWithCardsToReview
                                onClick={() => {
                                  screenStore.go({
                                    type: "deckMine",
                                    deckId: deck.id,
                                  });
                                }}
                                key={deck.id}
                                item={deck}
                              />
                            </div>
                          );
                        })
                      : null}
                  </Fragment>
                );
              })
            : null}

          {deckListStore.myInfo && !deckListStore.myDecks.length ? (
            <Hint>
              {t("no_personal_decks_start")}{" "}
              <span
                className={css({
                  color: theme.linkColor,
                })}
                onClick={() => {
                  screenStore.go({ type: "deckForm" });
                }}
              >
                {t("no_personal_decks_create")}
              </span>{" "}
              {t("no_personal_decks_explore")}
            </Hint>
          ) : null}

          {deckListStore.myInfo && deckListStore.myDecks.length > 0 ? (
            <Button
              icon={"mdi-plus"}
              onClick={() => {
                screenStore.go({ type: "deckOrFolderChoose" });
              }}
            >
              {t("add")}
            </Button>
          ) : null}

          {deckListStore.areAllDecksReviewed && (
            <Hint>{t("all_decks_reviewed")}</Hint>
          )}
        </div>
      </div>

      <div>
        <ListHeader text={t("public_decks")} />
        <div
          className={css({
            display: "flex",
            flexDirection: "column",
            gap: 6,
          })}
        >
          {deckListStore.myInfo ? (
            <>
              {deckListStore.publicDecks.map((deck) => (
                <PublicDeck key={deck.id} deck={deck} />
              ))}
              <button
                className={cx(
                  reset.button,
                  css({
                    paddingTop: 10,
                    paddingBottom: 6,
                    color: theme.linkColor,
                    fontSize: 16,
                  }),
                )}
                onClick={() => {
                  screenStore.go({ type: "deckCatalog" });
                }}
              >
                <i
                  className={cx(css({ color: "inherit" }), "mdi mdi-magnify")}
                />{" "}
                {t("explore_public_decks")}
              </button>
            </>
          ) : null}

          {deckListStore.isMyInfoLoading &&
            range(deckListStore.skeletonLoaderData.publicCount).map((i) => (
              <DeckLoading key={i} />
            ))}
        </div>
      </div>

      {deckListStore.myInfo && (
        <>
          <div>
            <ListHeader text={t("news_and_updates")} />
            <Button
              icon={"mdi-call-made"}
              onClick={() => {
                WebApp.openTelegramLink(links.botChannel);
              }}
            >
              {t("telegram_channel")}
            </Button>
          </div>
          <div>
            <Button
              icon={"mdi-cog"}
              onClick={() => {
                screenStore.go({ type: "userSettings" });
              }}
            >
              {t("settings")}
            </Button>
          </div>
        </>
      )}
    </div>
  );
});
