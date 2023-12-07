import { observer } from "mobx-react-lite";
import { css } from "@emotion/css";
import { Label } from "../../ui/label.tsx";
import { Input } from "../../ui/input.tsx";
import React from "react";
import { useMainButton } from "../../lib/telegram/use-main-button.tsx";
import { useDeckFormStore } from "../../store/deck-form-store-context.tsx";
import { screenStore } from "../../store/screen-store.ts";
import { useMount } from "../../lib/react/use-mount.ts";
import { useBackButton } from "../../lib/telegram/use-back-button.tsx";
import { useTelegramProgress } from "../../lib/telegram/use-telegram-progress.tsx";
import { assert } from "../../lib/typescript/assert.ts";
import { SettingsRow } from "../user-settings/settings-row.tsx";
import { Button } from "../../ui/button.tsx";

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
    () => deckFormStore.isDeckSaveButtonVisible,
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

      {deckFormStore.form.cards.length > 0 && (
        <SettingsRow
          onClick={() => {
            deckFormStore.goToCardList();
          }}
        >
          <span>Cards</span>
          <span>{deckFormStore.form.cards.length}</span>
        </SettingsRow>
      )}

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
