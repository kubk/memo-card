import { observer } from "mobx-react-lite";
import { useDeckFormStore } from "./store/deck-form-store-context.tsx";
import { screenStore } from "../../store/screen-store.ts";
import { assert } from "../../lib/typescript/assert.ts";
import { useBackButton } from "../../lib/platform/use-back-button.ts";
import { css, cx } from "@emotion/css";
import { Input } from "../../ui/input.tsx";
import { theme } from "../../ui/theme.tsx";
import { Button } from "../../ui/button.tsx";
import React from "react";
import { reset } from "../../ui/reset.ts";
import { t } from "../../translations/t.ts";
import { Screen } from "../shared/screen.tsx";
import { removeAllTags } from "../../lib/sanitize-html/remove-all-tags.ts";
import { tapScale } from "../../lib/animations/tap-scale.ts";
import { Flex } from "../../ui/flex.tsx";
import { CardNumber } from "../../ui/card-number.tsx";

export const CardList = observer(() => {
  const deckFormStore = useDeckFormStore();
  const screen = screenStore.screen;
  assert(screen.type === "deckForm");

  useBackButton(() => {
    deckFormStore.quitInnerScreen();
  });

  if (!deckFormStore.form) {
    return null;
  }

  return (
    <Screen title={t("cards")}>
      {deckFormStore.form.cards.length > 1 && (
        <>
          <Input
            field={deckFormStore.cardFilter.text}
            icon={"mdi-magnify mdi-24px"}
            placeholder={t("search_card")}
          />
          <Flex ml={12} gap={8}>
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
          </Flex>
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
            backgroundColor: theme.bgColor,
            borderRadius: theme.borderRadius,
            padding: 12,
            // If the card content is too big then hide it
            maxHeight: 120,
            overflow: "hidden",
            ...tapScale,
          })}
        >
          <div>
            <CardNumber number={i + 1} />
            {removeAllTags(cardForm.front.value)}
          </div>
          <div className={css({ color: theme.hintColor })}>
            {removeAllTags(cardForm.back.value)}
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
    </Screen>
  );
});
