import { observer } from "mobx-react-lite";
import { useUserSettingsStore } from "../../store/user-settings-store-context.tsx";
import { deckListStore } from "../../store/deck-list-store.ts";
import React from "react";
import { useMount } from "../../lib/react/use-mount.ts";
import { generateTimeRange } from "./generate-time-range.tsx";
import { useMainButton } from "../../lib/telegram/use-main-button.tsx";
import { useTelegramProgress } from "../../lib/telegram/use-telegram-progress.tsx";
import { ListHeader } from "../../ui/list-header.tsx";
import { SettingsRow } from "./settings-row.tsx";
import { RadioSwitcher } from "../../ui/radio-switcher.tsx";
import { theme } from "../../ui/theme.tsx";
import { Select } from "../../ui/select.tsx";
import { css } from "@emotion/css";
import { useBackButton } from "../../lib/telegram/use-back-button.tsx";
import { screenStore } from "../../store/screen-store.ts";
import { HintTransparent } from "../../ui/hint-transparent.tsx";
import { t } from "../../translations/t.ts";

export const timeRanges = generateTimeRange();

export const UserSettingsMain = observer(() => {
  const userSettingsStore = useUserSettingsStore();
  useMount(() => {
    userSettingsStore.load();
  });

  useMainButton(
    t("save"),
    () => userSettingsStore.submit(),
    () => userSettingsStore.isSaveVisible,
  );

  useBackButton(() => {
    screenStore.go({ type: "main" });
  });
  useTelegramProgress(() => userSettingsStore.isSending);

  if (!deckListStore.myInfo || !userSettingsStore.form) {
    return null;
  }

  const { isRemindNotifyEnabled, isSpeakingCardsEnabled, time } =
    userSettingsStore.form;

  return (
    <div>
      <ListHeader text={t("settings")} />

      <div
        className={css({
          display: "flex",
          flexDirection: "column",
          gap: 8,
        })}
      >
        <SettingsRow>
          <span>{t("settings_review_notifications")}</span>
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
            <span>{t("settings_time")}</span>
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

        <HintTransparent>
          {t("settings_review_notifications_hint")}
        </HintTransparent>

        <SettingsRow>
          <span>{t("speaking_cards")}</span>
          <span
            className={css({
              transform: "translateY(3px)",
              position: "relative",
            })}
          >
            <RadioSwitcher
              isOn={isSpeakingCardsEnabled.value}
              onToggle={isSpeakingCardsEnabled.toggle}
            />
          </span>
        </SettingsRow>

        <HintTransparent>{t("card_speak_description")}</HintTransparent>
      </div>
    </div>
  );
});
