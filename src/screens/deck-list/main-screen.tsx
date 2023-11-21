import React from "react";
import { observer } from "mobx-react-lite";
import { css } from "@emotion/css";
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
import { FullScreenLoader } from "./full-screen-loader.tsx";

export const MainScreen = observer(() => {
  useMount(() => {
    deckListStore.loadFirstTime(WebApp.initDataUnsafe.start_param);
  });

  if (deckListStore.isSharedDeckLoading) {
    return <FullScreenLoader />;
  }

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
          {deckListStore.myInfo?.state === "pending" &&
            range(deckListStore.skeletonLoaderData.myDecksCount).map((i) => (
              <DeckLoading key={i} />
            ))}
          {deckListStore.myInfo?.state === "fulfilled"
            ? deckListStore.myDecks.map((deck) => {
                return <MyDeck key={deck.id} deck={deck} />;
              })
            : null}

          {deckListStore.myInfo?.state === "fulfilled" &&
          !deckListStore.myDecks.length ? (
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

          {deckListStore.myInfo?.state === "fulfilled" &&
          deckListStore.myDecks.length > 0 ? (
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
          {deckListStore.myInfo?.state === "fulfilled" &&
          !deckListStore.publicDecks.length ? (
            <Hint>
              Wow! 🌟 You've added them all! There are no more public decks left
              to discover.
            </Hint>
          ) : null}

          {deckListStore.myInfo?.state === "fulfilled" ? (
            <>
              {deckListStore.publicDecks.map((deck) => (
                <PublicDeck key={deck.id} deck={deck} />
              ))}
            </>
          ) : null}

          {deckListStore.myInfo?.state === "pending" &&
            range(deckListStore.skeletonLoaderData.publicCount).map((i) => (
              <DeckLoading key={i} />
            ))}
        </div>
      </div>

      {deckListStore.myInfo?.state === "fulfilled" && (
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
              disabled={deckListStore.myInfo?.state !== "fulfilled"}
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
