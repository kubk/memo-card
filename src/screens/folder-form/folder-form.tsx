import { observer } from "mobx-react-lite";
import { Screen } from "../shared/screen.tsx";
import { Label } from "../../ui/label.tsx";
import { t } from "../../translations/t.ts";
import { Input } from "../../ui/input.tsx";
import React from "react";
import { useBackButton } from "../../lib/telegram/use-back-button.tsx";
import { screenStore } from "../../store/screen-store.ts";
import { useTelegramProgress } from "../../lib/telegram/use-telegram-progress.tsx";
import { useMount } from "../../lib/react/use-mount.ts";
import { useMainButton } from "../../lib/telegram/use-main-button.tsx";
import { assert } from "../../lib/typescript/assert.ts";
import { SettingsRow } from "../user-settings/settings-row.tsx";
import { reset } from "../../ui/reset.ts";
import { css, cx } from "@emotion/css";
import { theme } from "../../ui/theme.tsx";
import { Loader } from "../../ui/loader.tsx";
import { useFolderFormStore } from "./store/folder-form-store-context.tsx";
import { EmptyState } from "../../ui/empty-state.tsx";

export const FolderForm = observer(() => {
  const folderStore = useFolderFormStore();
  const { folderForm } = folderStore;
  const screen = screenStore.screen;
  assert(screen.type === "folderForm");

  useMount(() => {
    folderStore.loadForm();
  });

  useMainButton(
    t("save"),
    () => {
      folderStore.onFolderSave();
    },
    () => folderStore.isSaveButtonVisible,
  );

  useBackButton(() => {
    screenStore.back();
  });

  useTelegramProgress(() => folderStore.isSending);

  if (!folderForm) {
    return null;
  }

  return (
    <Screen title={screen.folderId ? "Edit folder" : "Add folder"}>
      <Label text={t("title")} isRequired>
        <Input field={folderForm.title} />
      </Label>
      <Label text={t("description")}>
        <Input field={folderForm.description} rows={3} type={"textarea"} />
      </Label>
      <Label text={"Decks"} isPlain>
        {folderForm.decks.value.map((deck, i) => {
          return (
            <SettingsRow key={i}>
              <span>{deck.name}</span>
              <button
                className={cx(
                  reset.button,
                  css({
                    padding: 8,
                    fontSize: 16,
                  }),
                )}
                onClick={() => {
                  assert(folderForm);
                  return folderForm.decks.removeByIndex(i);
                }}
              >
                <i
                  className={cx(
                    "mdi mdi-delete-circle mdi-24px",
                    css({
                      color: theme.danger,
                    }),
                  )}
                />
              </button>
            </SettingsRow>
          );
        })}
      </Label>
      <Label text={"Add deck to the folder"} isPlain>
        {folderStore.decksMine?.state === "pending" && <Loader />}
        {folderStore.decksMine?.state === "fulfilled" &&
        folderStore.decksMineFiltered.length === 0 ? (
          <EmptyState>No more decks to add</EmptyState>
        ) : null}
        {folderStore.decksMineFiltered.map((deck) => {
          return (
            <SettingsRow key={deck.id}>
              <span>{deck.name}</span>
              <button
                className={cx(reset.button, css({ padding: 8, fontSize: 16 }))}
                onClick={() => {
                  assert(folderForm);
                  folderForm.decks.add({
                    id: deck.id,
                    name: deck.name,
                  });
                }}
              >
                <i
                  className={cx(
                    "mdi mdi-plus-circle mdi-24px",
                    css({ color: theme.buttonColor }),
                  )}
                />
              </button>
            </SettingsRow>
          );
        })}
      </Label>
    </Screen>
  );
});
