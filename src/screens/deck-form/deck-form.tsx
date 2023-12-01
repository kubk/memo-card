import { observer } from "mobx-react-lite";
import { css } from "@emotion/css";
import { Label } from "../../ui/label.tsx";
import { Input } from "../../ui/input.tsx";
import { theme } from "../../ui/theme.tsx";
import { Button } from "../../ui/button.tsx";
import React from "react";
import { useMainButton } from "../../lib/telegram/use-main-button.tsx";
import { useDeckFormStore } from "../../store/deck-form-store-context.tsx";
import { screenStore } from "../../store/screen-store.ts";
import { useMount } from "../../lib/react/use-mount.ts";
import { useBackButton } from "../../lib/telegram/use-back-button.tsx";
import { useTelegramProgress } from "../../lib/telegram/use-telegram-progress.tsx";
import { assert } from "../../lib/typescript/assert.ts";
import { isFormTouched } from "../../lib/mobx-form/form-has-error.ts";
import { SettingsRow } from "../user-settings/settings-row.tsx";

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
      <h4 className={css({ textAlign: "center" })}>Cards</h4>
      {deckFormStore.form.cards.length > 1 && (
        <Input field={deckFormStore.cardFilter} placeholder={"Search card"} />
      )}
      {deckFormStore.filteredCards.map((cardForm, i) => (
        <div
          onClick={() => {
            deckFormStore.editCardForm(i);
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
        Add card
      </Button>
    </div>
  );
});

export const DeckForm = observer(() => {
  const deckFormStore = useDeckFormStore();
  const screen = screenStore.screen;
  assert(screen.type === "deckForm");

  useMount(() => {
    deckFormStore.loadForm();
  });
  useMainButton(
    "Save",
    () => {
      deckFormStore.onDeckSave();
    },
    () => Boolean(deckFormStore.form && isFormTouched(deckFormStore.form)),
  );
  useBackButton(() => {
    deckFormStore.onDeckBack();
  });
  useTelegramProgress(() => deckFormStore.isSending);

  if (!deckFormStore.form) {
    return null;
  }

  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        gap: 6,
        position: "relative",
        marginBottom: 16,
      })}
    >
      <h3 className={css({ textAlign: "center" })}>
        {screen.deckId ? "Edit deck" : "Add deck"}
      </h3>
      <Label text={"Title"} isRequired>
        <Input field={deckFormStore.form.title} />
      </Label>

      <Label text={"Description"}>
        <Input
          field={deckFormStore.form.description}
          rows={5}
          type={"textarea"}
        />
      </Label>

      <SettingsRow
        onClick={() => {
          deckFormStore.goToCardList();
        }}
      >
        <span>Cards</span>
        <span>{deckFormStore.form.cards.length}</span>
      </SettingsRow>
    </div>
  );
});
