import { observer } from "mobx-react-lite";
import { deckListStore } from "../../store/deck-list-store.ts";
import { css } from "@emotion/css";
import { theme } from "../../ui/theme.tsx";
import React from "react";
import { useReviewStore } from "./store/review-store-context.tsx";
import { screenStore } from "../../store/screen-store.ts";
import { Hint } from "../../ui/hint.tsx";
import { useBackButton } from "../../lib/telegram/use-back-button.tsx";
import { useMainButton } from "../../lib/telegram/use-main-button.tsx";
import { showConfirm } from "../../lib/telegram/show-confirm.ts";
import { ButtonSideAligned } from "../../ui/button-side-aligned.tsx";
import { useTelegramProgress } from "../../lib/telegram/use-telegram-progress.tsx";
import { duplicateDeckRequest } from "../../api/api.ts";
import { t } from "../../translations/t.ts";
import { userStore } from "../../store/user-store.ts";

export const DeckPreview = observer(() => {
  const reviewStore = useReviewStore();

  useBackButton(() => {
    const screen = screenStore.screen;
    if ("backScreen" in screen && screen.backScreen) {
      // backScreen is RouteType here
      // @ts-ignore
      screenStore.go({ type: screen.backScreen });
    } else {
      screenStore.back();
    }
  });

  useTelegramProgress(() => deckListStore.isDeckCardsLoading);

  useMainButton(
    t("review_deck"),
    () => {
      deckListStore.startDeckReview(reviewStore);
    },
    () => deckListStore.canReview,
  );

  const deck = deckListStore.selectedDeck;
  if (!deck) {
    return null;
  }

  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        gap: 16,
        paddingTop: 12,
        paddingBottom: 12,
      })}
    >
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
            <i className={"mdi mdi-cards-outline"} title={t("deck")} />
            {deck.name}
          </h3>
        </div>
        <div>
          <div>{deck.description}</div>
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
            <div className={css({ display: "flex", gap: 4 })}>
              <span>{t("cards_to_repeat")}: </span>
              <h4 className={css({ color: theme.orange })}>
                {
                  deck.cardsToReview.filter((card) => card.type === "repeat")
                    .length
                }
              </h4>
            </div>
            <div className={css({ display: "flex", gap: 4 })}>
              <span>{t("cards_new")}: </span>
              <h4 className={css({ color: theme.success })}>
                {
                  deck.cardsToReview.filter((card) => card.type === "new")
                    .length
                }
              </h4>
            </div>
            <div className={css({ display: "flex", gap: 4 })}>
              <span>{t("cards_total")}: </span>
              <h4>{deck.deck_card.length}</h4>
            </div>
          </div>
        )}

        <div
          className={css({
            gap: 16,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
          })}
        >
          {deckListStore.canEditDeck ? (
            <ButtonSideAligned
              icon={"mdi-plus-circle mdi-24px"}
              outline
              onClick={() => {
                screenStore.go({
                  type: "cardQuickAddForm",
                  deckId: deck.id,
                });
              }}
            >
              {t("add_card_short")}
            </ButtonSideAligned>
          ) : null}
          {userStore.isAdmin && (
            <ButtonSideAligned
              icon={"mdi-content-duplicate mdi-24px"}
              outline
              onClick={() => {
                showConfirm(t("duplicate_confirm")).then(() => {
                  duplicateDeckRequest(deck.id).then(() => {
                    screenStore.go({ type: "main" });
                  });
                });
              }}
            >
              {t("duplicate")}
            </ButtonSideAligned>
          )}
          {deckListStore.canEditDeck ? (
            <ButtonSideAligned
              icon={"mdi-pencil-circle mdi-24px"}
              outline
              onClick={() => {
                screenStore.go({ type: "deckForm", deckId: deck.id });
              }}
            >
              {t("edit")}
            </ButtonSideAligned>
          ) : null}

          {deckListStore.canEditDeck && (
            <ButtonSideAligned
              icon={"mdi-share-circle mdi-24px"}
              outline
              onClick={() => {
                screenStore.go({
                  type: "shareDeck",
                  deckId: deck.id,
                  shareId: deck.share_id,
                });
              }}
            >
              {t("share")}
            </ButtonSideAligned>
          )}

          {screenStore.screen.type === "deckMine" ? (
            <ButtonSideAligned
              icon={"mdi-delete-circle mdi-24px"}
              outline
              onClick={() => {
                showConfirm(t("delete_deck_confirm")).then(() => {
                  deckListStore.removeDeck();
                });
              }}
            >
              {t("delete")}
            </ButtonSideAligned>
          ) : null}
        </div>
      </div>
      {deck.cardsToReview.length === 0 && (
        <Hint>{t("no_cards_to_review_in_deck")}</Hint>
      )}
    </div>
  );
});
