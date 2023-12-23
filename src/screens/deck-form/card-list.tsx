import { observer } from "mobx-react-lite";
import { useDeckFormStore } from "../../store/deck-form-store-context.tsx";
import { screenStore } from "../../store/screen-store.ts";
import { assert } from "../../lib/typescript/assert.ts";
import { useBackButton } from "../../lib/telegram/use-back-button.tsx";
import { css, cx } from "@emotion/css";
import { Input } from "../../ui/input.tsx";
import { theme } from "../../ui/theme.tsx";
import { Button } from "../../ui/button.tsx";
import React from "react";
import { reset } from "../../ui/reset.ts";
import { t } from "../../translations/t.ts";

export const CardList = observer(() => {
  const deckFormStore = useDeckFormStore();
  const screen = screenStore.screen;
  assert(screen.type === "deckForm");

  useBackButton(() => {
    deckFormStore.quitCardList();
  });

  if (!deckFormStore.form) {
    return null;
  }

  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        gap: 6,
        marginBottom: 16,
      })}
    >
      <h3 className={css({ textAlign: "center" })}>{t("cards")}</h3>
      {deckFormStore.form.cards.length > 1 && (
        <>
          <Input
            field={deckFormStore.cardFilter.text}
            placeholder={t("search_card")}
          />
          <div
            className={css({
              display: "flex",
              marginLeft: 12,
              gap: 8,
            })}
          >
            <span>{t("sort_by")}</span>
            {[
              {
                label: t("card_sort_by_date"),
                fieldName: "createdAt" as const,
              },
              {
                label: t("card_sort_by_front"),
                fieldName: "frontAlpha" as const,
              },
              {
                label: t("card_sort_by_back"),
                fieldName: "backAlpha" as const,
              },
            ].map((item, i) => {
              const isSelected =
                deckFormStore.cardFilter.sortBy.value === item.fieldName;

              return (
                <button
                  key={i}
                  className={cx(
                    reset.button,
                    css({
                      color: isSelected ? theme.linkColor : undefined,
                      cursor: "pointer",
                      fontSize: 16,
                    }),
                  )}
                  onClick={() => {
                    deckFormStore.changeSort(item.fieldName);
                  }}
                >
                  {item.label}{" "}
                  {isSelected ? (deckFormStore.isSortAsc ? "↓" : "↑") : null}
                </button>
              );
            })}
          </div>
        </>
      )}
      {deckFormStore.filteredCards.map((cardForm, i) => (
        <div
          onClick={() => {
            deckFormStore.editCardFormById(cardForm.id);
          }}
          key={i}
          className={css({
            cursor: "pointer",
            backgroundColor: theme.secondaryBgColor,
            borderRadius: theme.borderRadius,
            padding: 12,
          })}
        >
          <div>{cardForm.front.value}</div>
          <div className={css({ color: theme.hintColor })}>
            {cardForm.back.value}
          </div>
        </div>
      ))}
      <Button
        onClick={() => {
          deckFormStore.openNewCardForm();
        }}
      >
        {t("add_card")}
      </Button>
    </div>
  );
});
