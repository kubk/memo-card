import { observer } from "mobx-react-lite";
import { useUserSettingsStore } from "./store/user-settings-store-context.tsx";
import { deckListStore } from "../../store/deck-list-store.ts";
import React from "react";
import { useMount } from "../../lib/react/use-mount.ts";
import { generateTimeRange } from "./generate-time-range.tsx";
import { useMainButton } from "../../lib/telegram/use-main-button.tsx";
import { useTelegramProgress } from "../../lib/telegram/use-telegram-progress.tsx";
import { CardRow } from "../../ui/card-row.tsx";
import { RadioSwitcher } from "../../ui/radio-switcher.tsx";
import { theme } from "../../ui/theme.tsx";
import { Select } from "../../ui/select.tsx";
import { css } from "@emotion/css";
import { useBackButton } from "../../lib/telegram/use-back-button.tsx";
import { screenStore } from "../../store/screen-store.ts";
import { HintTransparent } from "../../ui/hint-transparent.tsx";
import { t } from "../../translations/t.ts";
import { Screen } from "../shared/screen.tsx";
import WebApp from "@twa-dev/sdk";
import { links } from "../shared/links.ts";

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
    screenStore.back();
  });
  useTelegramProgress(() => userSettingsStore.isSending);

  if (!deckListStore.myInfo || !userSettingsStore.form) {
    return null;
  }

  const { isRemindNotifyEnabled, isSpeakingCardsEnabled, time } =
    userSettingsStore.form;

  return (
    <Screen title={t("settings")}>
      <CardRow>
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
      </CardRow>
      {isRemindNotifyEnabled.value && (
        <CardRow>
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
        </CardRow>
      )}

      <HintTransparent>
        {t("settings_review_notifications_hint")}
      </HintTransparent>

      <CardRow>
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
      </CardRow>

      <HintTransparent>{t("card_speak_description")}</HintTransparent>

      <CardRow
        onClick={() => {
          WebApp.openTelegramLink(links.supportChat);
        }}
      >
        <span
          className={css({
            color: theme.linkColor,
          })}
        >
          Contact support
        </span>
      </CardRow>
    </Screen>
  );
});
