import { observer } from "mobx-react-lite";
import { useBackButton } from "../../lib/telegram/use-back-button.tsx";
import { ListHeader } from "../../ui/list-header.tsx";
import { Hint } from "../../ui/hint.tsx";
import React from "react";
import { useUserSettingsStore } from "../../store/user-settings-store-context.tsx";
import { css } from "@emotion/css";
import { theme } from "../../ui/theme.tsx";
import { RadioSwitcher } from "../../ui/radio-switcher.tsx";
import { Select } from "../../ui/select.tsx";
import { SettingsRow } from "./settings-row.tsx";
import { generateTimeRange } from "./generate-time-range.tsx";
import { useMainButton } from "../../lib/telegram/use-main-button.tsx";
import { useTelegramProgress } from "../../lib/telegram/use-telegram-progress.tsx";

export const timeRanges = generateTimeRange();

export const UserReviewNotificationSettings = observer(() => {
  const userSettingsStore = useUserSettingsStore();

  useBackButton(() => {
    userSettingsStore.goToMain();
  });

  useMainButton(
    "Save",
    () => userSettingsStore.submit(),
    () => userSettingsStore.isSaveVisible,
  );

  useTelegramProgress(() => userSettingsStore.isSending);

  if (!userSettingsStore.form) {
    return null;
  }

  const { isRemindNotifyEnabled, time } = userSettingsStore.form;

  return (
    <div>
      <ListHeader text={"Review notification settings"} />

      <div
        className={css({
          display: "flex",
          flexDirection: "column",
          gap: 8,
        })}
      >
        <SettingsRow>
          <span>Notifications</span>
          <span
            className={css({
              transform: "translateY(3px)",
              position: "relative",
            })}
          >
            <RadioSwitcher
              isOn={isRemindNotifyEnabled.value}
              onToggle={isRemindNotifyEnabled.toggle}
            />
          </span>
        </SettingsRow>
        {isRemindNotifyEnabled.value && (
          <SettingsRow>
            <span>Time</span>
            <div className={css({ color: theme.linkColor })}>
              <Select
                value={time.value.toString()}
                onChange={(value) => {
                  time.onChange(value);
                }}
                options={timeRanges.map((range) => ({
                  value: range,
                  label: range,
                }))}
              />
            </div>
          </SettingsRow>
        )}

        <Hint>
          ⭐ Daily reminders help you keep up with your reviews, making it
          easier for you to remember the information
        </Hint>
      </div>
    </div>
  );
});
