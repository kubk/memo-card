import { observer } from "mobx-react-lite";
import { useUserSettingsStore } from "./store/user-settings-store-context.tsx";
import { deckListStore } from "../../store/deck-list-store.ts";
import React from "react";
import { useMount } from "../../lib/react/use-mount.ts";
import { generateTimeRange } from "./generate-time-range.tsx";
import { useMainButton } from "../../lib/platform/use-main-button.ts";
import { useMainButtonProgress } from "../../lib/platform/use-main-button-progress.tsx";
import { RadioSwitcher } from "../../ui/radio-switcher.tsx";
import { theme } from "../../ui/theme.tsx";
import { Select } from "../../ui/select.tsx";
import { css } from "@emotion/css";
import { useBackButton } from "../../lib/platform/use-back-button.ts";
import { screenStore } from "../../store/screen-store.ts";
import { HintTransparent } from "../../ui/hint-transparent.tsx";
import { t } from "../../translations/t.ts";
import { Screen } from "../shared/screen.tsx";
import { links } from "../shared/links.ts";
import { List } from "../../ui/list.tsx";
import { FilledIcon } from "../../ui/filled-icon.tsx";
import { boolNarrow } from "../../lib/typescript/bool-narrow.ts";
import { platform } from "../../lib/platform/platform.ts";

export const timeRanges = generateTimeRange();

export const UserSettingsScreen = observer(() => {
  const userSettingsStore = useUserSettingsStore();
  useMount(() => {
    userSettingsStore.load();
  });

  useMainButton(t("save"), () => userSettingsStore.submit());

  useBackButton(() => {
    screenStore.back();
  });
  useMainButtonProgress(() => userSettingsStore.userSettingsRequest.isLoading);

  if (!deckListStore.myInfo || !userSettingsStore.form) {
    return null;
  }

  const { isRemindNotifyEnabled, isSpeakingCardsEnabled, time } =
    userSettingsStore.form;

  return (
    <Screen title={t("settings")}>
      <div>
        <List
          items={[
            {
              icon: (
                <FilledIcon
                  backgroundColor={theme.icons.turquoise}
                  icon={"mdi-snowflake"}
                />
              ),
              text: t("freeze_title"),
              onClick: () => {
                screenStore.go({ type: "freezeCards" });
              },
            },
          ]}
        />

        <HintTransparent>{t("freeze_hint")}</HintTransparent>
      </div>

      <div>
        <List
          items={[
            {
              icon: (
                <FilledIcon
                  backgroundColor={theme.icons.violet}
                  icon={"mdi-bell"}
                />
              ),
              right: (
                <span
                  className={css({
                    top: 3,
                    position: "relative",
                  })}
                >
                  <RadioSwitcher
                    isOn={isRemindNotifyEnabled.value}
                    onToggle={isRemindNotifyEnabled.toggle}
                  />
                </span>
              ),
              text: t("settings_review_notifications"),
            },
            isRemindNotifyEnabled.value
              ? {
                  icon: (
                    <FilledIcon
                      backgroundColor={theme.icons.blue}
                      icon={"mdi-clock-time-five-outline"}
                    />
                  ),
                  text: t("settings_time"),
                  right: (
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
                  ),
                }
              : null,
          ].filter(boolNarrow)}
        />

        <HintTransparent>
          {t("settings_review_notifications_hint")}
        </HintTransparent>
      </div>

      <div>
        <List
          animateTap={false}
          items={[
            {
              icon: (
                <FilledIcon
                  backgroundColor={theme.icons.pink}
                  icon={"mdi-account-voice"}
                />
              ),
              right: (
                <span
                  className={css({
                    top: 3,
                    position: "relative",
                  })}
                >
                  <RadioSwitcher
                    isOn={isSpeakingCardsEnabled.value}
                    onToggle={isSpeakingCardsEnabled.toggle}
                  />
                </span>
              ),
              text: t("speaking_cards"),
            },
          ]}
        />

        <HintTransparent>{t("card_speak_description")}</HintTransparent>
      </div>

      <div>
        <List
          items={[
            {
              icon: (
                <FilledIcon
                  backgroundColor={theme.icons.sea}
                  icon={"mdi-star"}
                />
              ),
              text: "Pro",
              onClick: () => {
                screenStore.go({ type: "plans" });
              },
            },
          ]}
        />

        <HintTransparent>{t("payment_description")}</HintTransparent>
      </div>

      <div>
        <List
          items={[
            {
              icon: (
                <FilledIcon
                  backgroundColor={theme.icons.green}
                  icon={"mdi-face-agent"}
                />
              ),
              text: t("settings_contact_support"),
              onClick: () => {
                platform.openInternalLink(links.supportChat);
              },
              isLinkColor: true,
            },
          ]}
        />

        <HintTransparent>{t("settings_support_hint")}</HintTransparent>
      </div>
    </Screen>
  );
});
