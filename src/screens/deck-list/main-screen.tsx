import React from "react";
import { observer } from "mobx-react-lite";
import { css, cx } from "@emotion/css";
import { PublicDeck } from "./public-deck.tsx";
import { MyDeck } from "./my-deck.tsx";
import { deckListStore } from "../../store/deck-list-store.ts";
import { useMount } from "../../lib/react/use-mount.ts";
import { Hint } from "../../ui/hint.tsx";
import { theme } from "../../ui/theme.tsx";
import { screenStore } from "../../store/screen-store.ts";
import { Button } from "../../ui/button.tsx";
import { DeckLoading } from "./deck-loading.tsx";
import WebApp from "@twa-dev/sdk";
import { assert } from "../../lib/typescript/assert.ts";
import { ListHeader } from "../../ui/list-header.tsx";
import { range } from "../../lib/array/range.ts";
import { reset } from "../../ui/reset.ts";

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
        <ListHeader text={"My decks"} />
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
            ? deckListStore.myDecks.map((deck) => {
                return <MyDeck key={deck.id} deck={deck} />;
              })
            : null}

          {deckListStore.myInfo && !deckListStore.myDecks.length ? (
            <Hint>
              You don't have any personal deck yet. Feel free to{" "}
              <span
                className={css({
                  color: theme.linkColor,
                })}
                onClick={() => {
                  screenStore.go({ type: "deckForm" });
                }}
              >
                create one
              </span>{" "}
              or explore the public decks below. Happy learning! 😊
            </Hint>
          ) : null}

          {deckListStore.myInfo && deckListStore.myDecks.length > 0 ? (
            <Button
              icon={"mdi-plus"}
              onClick={() => {
                screenStore.go({ type: "deckForm" });
              }}
            >
              Add deck
            </Button>
          ) : null}

          {deckListStore.areAllDecksReviewed && (
            <Hint>
              Amazing work! 🌟 You've reviewed all the decks for now. Come back
              later for more.
            </Hint>
          )}
        </div>
      </div>

      <div>
        <ListHeader text={"Public decks"} />
        <div
          className={css({
            display: "flex",
            flexDirection: "column",
            gap: 6,
          })}
        >
          {deckListStore.myInfo ? (
            <>
              {deckListStore.publicDecksToDisplay.map((deck) => (
                <PublicDeck key={deck.id} deck={deck} />
              ))}
              <button
                className={cx(
                  reset.button,
                  css({
                    marginTop: 6,
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
                Explore more decks
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
            <ListHeader text={"News and updates"} />
            <Button
              icon={"mdi-call-made"}
              onClick={() => {
                const channelLink = import.meta.env.VITE_CHANNEL_LINK;
                assert(channelLink, "Channel link env variable is empty");

                WebApp.openTelegramLink(channelLink);
              }}
            >
              Telegram channel
            </Button>
          </div>
          <div>
            <Button
              icon={"mdi-cog"}
              onClick={() => {
                screenStore.go({ type: "userSettings" });
              }}
            >
              Settings
            </Button>
          </div>
        </>
      )}
    </div>
  );
});
