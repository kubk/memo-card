import { useBackButton } from "../../lib/platform/use-back-button.ts";
import { screenStore } from "../../store/screen-store.ts";
import { useMainButton } from "../../lib/platform/use-main-button.ts";
import { t } from "../../translations/t.ts";
import { useProgress } from "../../lib/platform/use-progress.tsx";
import { CardRow } from "../../ui/card-row.tsx";
import { RadioSwitcher } from "../../ui/radio-switcher.tsx";
import { HintTransparent } from "../../ui/hint-transparent.tsx";
import { Label } from "../../ui/label.tsx";
import { Input } from "../../ui/input.tsx";
import { useShareDeckStore } from "./store/share-deck-store-context.tsx";
import { Screen } from "../shared/screen.tsx";

export function ShareDeckSettings() {
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
      store.shareDeckOrFolder();
    },
    () => store.isSaveButtonVisible,
  );

  useProgress(() => store.addDeckAccessRequest.isLoading);

  return (
    <Screen title={t("share_deck_settings")}>
      <CardRow>
        <span>{t("share_one_time_access_link")}</span>
        <RadioSwitcher
          isOn={store.form.isOneTime.value}
          onToggle={store.form.isOneTime.toggle}
        />
      </CardRow>
      <HintTransparent>
        {t("share_one_time_access_link_description")}
      </HintTransparent>
      {store.form.isOneTime.value && (
        <>
          <CardRow>
            <span>{t("share_access_duration")}</span>
            <RadioSwitcher
              isOn={store.form.isAccessDuration.value}
              onToggle={store.form.isAccessDuration.toggle}
            />
          </CardRow>
        </>
      )}
      {store.form.isOneTime.value && store.form.isAccessDuration.value && (
        <Label text={t("share_days")}>
          <Input field={store.form.accessDurationLimitDays} />
          <HintTransparent>{t("share_days_description")}</HintTransparent>
        </Label>
      )}

      <CardRow
        onClick={() => {
          store.isDeckAccessesOpen.setTrue();
        }}
      >
        {t("share_one_time_links_usage")}
      </CardRow>
    </Screen>
  );
}
