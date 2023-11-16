import { observer } from "mobx-react-lite";
import { useUserSettingsStore } from "../../store/user-settings-store-context.tsx";
import { deckListStore } from "../../store/deck-list-store.ts";
import { UserSettingsScreen } from "../../store/user-settings-store.tsx";
import { UserReviewNotificationSettings } from "./user-review-notification-settings.tsx";
import React from "react";
import { UserSettings } from "./user-settings.tsx";
import { useMount } from "../../lib/react/use-mount.ts";

export const UserSettingsMain = observer(() => {
  const userSettingsStore = useUserSettingsStore();

  useMount(() => {
    userSettingsStore.load();
  });

  if (deckListStore.myInfo?.state !== "fulfilled") {
    return null;
  }

  if (userSettingsStore.screen === UserSettingsScreen.UserReviewSettings) {
    return <UserReviewNotificationSettings />;
  }

  return <UserSettings />;
});
