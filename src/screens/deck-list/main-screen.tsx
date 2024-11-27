import React, { Fragment, useState } from "react";
import { observer } from "mobx-react-lite";
import { css, cx } from "@emotion/css";
import { PublicDeck } from "./public-deck.tsx";
import { DeckRowWithCardsToReview } from "../shared/deck-row-with-cards-to-review/deck-row-with-cards-to-review.tsx";
import { deckListStore } from "../../store/deck-list-store.ts";
import { useMount } from "../../lib/react/use-mount.ts";
import { Hint } from "../../ui/hint.tsx";
import { theme } from "../../ui/theme.tsx";
import { screenStore } from "../../store/screen-store.ts";
import { CardRowLoading } from "../shared/card-row-loading.tsx";
import { ListHeader } from "../../ui/list-header.tsx";
import { range } from "../../lib/array/range.ts";
import { reset } from "../../ui/reset.ts";
import { ViewMoreDecksToggle } from "./view-more-decks-toggle.tsx";
import { t } from "../../translations/t.ts";
import { links } from "../../../shared/links/links.ts";
import { tapScale } from "../../lib/animations/tap-scale.ts";
import { Flex } from "../../ui/flex.tsx";
import { List } from "../../ui/list.tsx";
import { FilledIcon } from "../../ui/filled-icon.tsx";
import { CardsToReview } from "../../ui/cards-to-review.tsx";
import { platform } from "../../lib/platform/platform.ts";
import { YouTubeIcon } from "../shared/youtube/youtube.tsx";
import { boolNarrow } from "../../lib/typescript/bool-narrow.ts";
import { ButtonSideAligned } from "../../ui/button-side-aligned.tsx";
import { DeckOrFolderChoose } from "./deck-or-folder-choose/deck-or-folder-choose.tsx";
import { BooleanToggle } from "mobx-form-lite";
import { RuEduVideoChoice } from "./ru-edu-video-choice.tsx";
import { getTelegramChannelLink } from "../../../shared/links/get-telegram-channel-link.ts";
import { getYouTubeChannelLink } from "../../../shared/links/get-youtube-channel-link.ts";

export const MainScreen = observer(() => {
  const [deckFolderToggle] = useState(() => new BooleanToggle(false));
  const [ruEduVideoToggle] = useState(() => new BooleanToggle(false));

  useMount(() => {
    console.log('mc: load first time');
    deckListStore.loadFirstTime(platform.getStartParam());
  });

  return (
    <Flex direction={"column"} gap={12} pb={48}>
      <DeckOrFolderChoose toggle={deckFolderToggle} />
      <RuEduVideoChoice toggle={ruEduVideoToggle} />

      <div>
        <ListHeader
          text={t("my_decks")}
          rightSlot={
            deckListStore.shouldShowMyDecksToggle ? (
              <ViewMoreDecksToggle />
            ) : undefined
          }
        />
        <Flex direction={"column"} gap={6}>
          {deckListStore.myInfoRequest.isLoading &&
            range(deckListStore.skeletonLoaderData.myDecksCount).map((i) => (
              <CardRowLoading key={i} />
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
                    deckListStore.isMyDecksExpanded.value ? (
                      <div className={css({ marginLeft: 24 })}>
                        <List
                          items={listItem.decks.map((deck) => {
                            return {
                              onClick: () => {
                                screenStore.go({
                                  type: "deckMine",
                                  deckId: deck.id,
                                });
                              },
                              text: deck.name,
                              right: <CardsToReview item={deck} />,
                            };
                          })}
                        />
                      </div>
                    ) : null}
                  </Fragment>
                );
              })
            : null}

          {deckListStore.myInfo && !deckListStore.myDecks.length ? (
            <Hint>
              <div>
                {t("browser_no_personal_decks_start")}
                <br />

                {t("browser_no_personal_decks_link")}
                <span
                  className={css({
                    color: theme.linkColor,
                    cursor: "pointer",
                  })}
                  onClick={() => {
                    if (platform.getLanguage() === "ru") {
                      ruEduVideoToggle.setTrue();
                    } else {
                      platform.openExternalLink(links.youtubeChannelEn);
                    }
                  }}
                >
                  {platform.getLanguage() === "ru"
                    ? "обучающие видео"
                    : "YouTube"}
                </span>

                {t("browser_no_personal_decks_end")}
              </div>
            </Hint>
          ) : null}

          {deckListStore.myInfo ? (
            <ButtonSideAligned
              align={"center"}
              icon={"mdi-plus-circle mdi-24px"}
              outline
              onClick={() => {
                if (deckListStore.myDecks.length > 0) {
                  deckFolderToggle.setTrue();
                } else {
                  screenStore.goToDeckForm({});
                }
              }}
            >
              {t("add")}
            </ButtonSideAligned>
          ) : null}

          {deckListStore.areAllDecksReviewed && (
            <Hint>{t("all_decks_reviewed")}</Hint>
          )}
        </Flex>
      </div>

      <div>
        <ListHeader text={t("public_decks")} />
        <Flex direction={"column"} gap={6}>
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
                    ...tapScale,
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

          {deckListStore.myInfoRequest.isLoading &&
            range(deckListStore.skeletonLoaderData.publicCount).map((i) => (
              <CardRowLoading key={i} />
            ))}
        </Flex>
      </div>

      {deckListStore.myInfo && (
        <>
          <div>
            <ListHeader text={t("news_and_updates")} />
            <List
              items={[
                {
                  text: t("telegram_channel"),
                  icon: (
                    <FilledIcon
                      icon={"mdi-call-made"}
                      backgroundColor={theme.icons.blue}
                    />
                  ),
                  onClick: () => {
                    platform.openInternalLink(getTelegramChannelLink());
                  },
                },

                platform.getLanguage() === "ru"
                  ? {
                      text: "Обучающие видео",
                      onClick: () => {
                        ruEduVideoToggle.setTrue();
                      },
                      icon: (
                        <FilledIcon
                          icon={"mdi-video"}
                          backgroundColor={theme.danger}
                        />
                      ),
                    }
                  : {
                      text: t("youtube_channel"),
                      icon: (
                        <FilledIcon
                          icon={<YouTubeIcon />}
                          backgroundColor={theme.danger}
                        />
                      ),
                      onClick: () => {
                        platform.openExternalLink(getYouTubeChannelLink());
                      },
                    },
              ].filter(boolNarrow)}
            />
          </div>

          <div>
            <ListHeader text={t("profile_section")} />
            <List
              items={[
                {
                  text: t("user_stats_btn"),
                  icon: (
                    <FilledIcon
                      backgroundColor={theme.icons.violet}
                      icon={"mdi-chart-bar"}
                    />
                  ),
                  onClick: () => {
                    screenStore.go({ type: "userStatistics" });
                  },
                },
                {
                  text: t("settings"),
                  icon: (
                    <FilledIcon
                      backgroundColor={theme.icons.pink}
                      icon={"mdi-cog"}
                    />
                  ),
                  onClick: () => {
                    screenStore.goToUserSettings();
                  },
                },
              ]}
            />
          </div>
        </>
      )}
    </Flex>
  );
});
