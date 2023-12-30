import { observer } from "mobx-react-lite";
import { Screen } from "../shared/screen.tsx";
import { Label } from "../../ui/label.tsx";
import { t } from "../../translations/t.ts";
import { Input } from "../../ui/input.tsx";
import React, { useState } from "react";
import { useBackButton } from "../../lib/telegram/use-back-button.tsx";
import { screenStore } from "../../store/screen-store.ts";
import { useTelegramProgress } from "../../lib/telegram/use-telegram-progress.tsx";
import { useMount } from "../../lib/react/use-mount.ts";
import { useMainButton } from "../../lib/telegram/use-main-button.tsx";
import { FolderFormStore } from "./folder-form-store.ts";
import { assert } from "../../lib/typescript/assert.ts";

export const FolderForm = observer(() => {
  const [folderStore] = useState(() => new FolderFormStore());
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
      <Label text={"Title"} isRequired>
        <Input field={folderForm.title} />
      </Label>
    </Screen>
  );
});
