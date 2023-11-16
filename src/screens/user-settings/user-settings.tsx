import React from "react";
import { observer } from "mobx-react-lite";
import { useBackButton } from "../../lib/telegram/use-back-button.tsx";
import { screenStore } from "../../store/screen-store.ts";
import { ListHeader } from "../../ui/list-header.tsx";
import { css } from "@emotion/css";
import { theme } from "../../ui/theme.tsx";
import { deckListStore } from "../../store/deck-list-store.ts";
import { DateTime } from "luxon";
import { assert } from "../../lib/typescript/assert.ts";
import { UserSettingsScreen } from "../../store/user-settings-store.tsx";
import { useUserSettingsStore } from "../../store/user-settings-store-context.tsx";
import { formatTime } from "./generate-time-range.tsx";

export const UserSettings = observer(() => {
  const userSettingsStore = useUserSettingsStore();

  useBackButton(() => {
    screenStore.navigateToMain();
  });

  return (
    <div>
      <ListHeader text={"Settings"} />
      <div
        className={css({
          backgroundColor: theme.secondaryBgColor,
          borderRadius: theme.borderRadius,
          padding: "8px 12px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
        })}
        onClick={() => {
          userSettingsStore.goToUserReviewSettings();
        }}
      >
        <span>Review notification</span>
        <span className={css({ color: theme.linkColor })}>
          {userSettingsStore.notifyTimePreview}
        </span>
      </div>
    </div>
  );
});
