import { observer } from "mobx-react-lite";
import { ShareDeckStore } from "./store/share-deck-store.ts";
import { useBackButton } from "../../lib/telegram/use-back-button.tsx";
import { screenStore } from "../../store/screen-store.ts";
import { useMainButton } from "../../lib/telegram/use-main-button.tsx";
import { t } from "../../translations/t.ts";
import { useTelegramProgress } from "../../lib/telegram/use-telegram-progress.tsx";
import { ShareDeckOneTimeLinks } from "./share-deck-one-time-links.tsx";
import { css } from "@emotion/css";
import { SettingsRow } from "../user-settings/settings-row.tsx";
import { RadioSwitcher } from "../../ui/radio-switcher.tsx";
import { HintTransparent } from "../../ui/hint-transparent.tsx";
import { Label } from "../../ui/label.tsx";
import { Input } from "../../ui/input.tsx";
import React from "react";

export const ShareDeckSettings = observer(
  (props: { store: ShareDeckStore }) => {
    const { store } = props;

    useBackButton(() => {
      screenStore.back();
    });

    useMainButton(
      () => {
        return store.form.isOneTime.value
          ? t("share_one_time_link")
          : t("share_perpetual_link");
      },
      () => {
        store.shareDeck();
      },
      () => store.isSaveButtonVisible,
    );

    useTelegramProgress(() => store.isSending);

    if (store.isDeckAccessesOpen.value) {
      return <ShareDeckOneTimeLinks store={store} />;
    }

    return (
      <div
        className={css({
          display: "flex",
          flexDirection: "column",
          gap: 16,
          marginBottom: 16,
          position: "relative",
        })}
      >
        <h3 className={css({ textAlign: "center" })}>
          {t("share_deck_settings")}
        </h3>
        <SettingsRow>
          <span>{t("share_one_time_access_link")}</span>
          <RadioSwitcher
            isOn={store.form.isOneTime.value}
            onToggle={store.form.isOneTime.toggle}
          />
        </SettingsRow>
        <HintTransparent marginTop={-12}>
          {t("share_one_time_access_link_description")}
        </HintTransparent>
        {store.form.isOneTime.value && (
          <>
            <SettingsRow>
              <span>{t("share_access_duration")}</span>
              <RadioSwitcher
                isOn={store.form.isAccessDuration.value}
                onToggle={store.form.isAccessDuration.toggle}
              />
            </SettingsRow>
          </>
        )}
        {store.form.isOneTime.value && store.form.isAccessDuration.value && (
          <Label text={t("share_days")}>
            <Input field={store.form.accessDurationLimitDays} />
            <HintTransparent>{t("share_days_description")}</HintTransparent>
          </Label>
        )}

        <SettingsRow
          onClick={() => {
            store.isDeckAccessesOpen.setTrue();
          }}
        >
          {t("share_one_time_links_usage")}
        </SettingsRow>
      </div>
    );
  },
);
