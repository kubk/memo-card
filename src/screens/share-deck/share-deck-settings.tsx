import { observer } from "mobx-react-lite";
import { useBackButton } from "../../lib/telegram/use-back-button.tsx";
import { screenStore } from "../../store/screen-store.ts";
import { useMainButton } from "../../lib/telegram/use-main-button.tsx";
import { t } from "../../translations/t.ts";
import { useTelegramProgress } from "../../lib/telegram/use-telegram-progress.tsx";
import { SettingsRow } from "../user-settings/settings-row.tsx";
import { RadioSwitcher } from "../../ui/radio-switcher.tsx";
import { HintTransparent } from "../../ui/hint-transparent.tsx";
import { Label } from "../../ui/label.tsx";
import { Input } from "../../ui/input.tsx";
import React from "react";
import { useShareDeckStore } from "./store/share-deck-store-context.tsx";
import { Screen } from "../shared/screen.tsx";

export const ShareDeckSettings = observer(() => {
  const store = useShareDeckStore();

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

  return (
    <Screen title={t("share_deck_settings")}>
      <SettingsRow>
        <span>{t("share_one_time_access_link")}</span>
        <RadioSwitcher
          isOn={store.form.isOneTime.value}
          onToggle={store.form.isOneTime.toggle}
        />
      </SettingsRow>
      <HintTransparent>
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
    </Screen>
  );
});
