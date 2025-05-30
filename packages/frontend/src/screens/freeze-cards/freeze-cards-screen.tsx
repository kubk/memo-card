import { Screen } from "../shared/screen.tsx";
import { useBackButton } from "../../lib/platform/use-back-button.ts";
import { screenStore } from "../../store/screen-store.ts";
import { useState } from "react";
import { theme } from "../../ui/theme.tsx";
import { Flex } from "../../ui/flex.tsx";
import { useMainButton } from "../../lib/platform/use-main-button.ts";
import { Input } from "../../ui/input.tsx";
import { DateTime } from "luxon";
import { Chip } from "../../ui/chip.tsx";
import { FreezeCardsStore } from "./store/freeze-cards-store.ts";
import { FilledIcon } from "../../ui/filled-icon.tsx";
import { useProgress } from "../../lib/platform/use-progress.tsx";
import { t } from "../../translations/t.ts";
import { formatDays } from "./translations.ts";
import { List } from "../../ui/list.tsx";
import { BottomSheet } from "../../ui/bottom-sheet/bottom-sheet.tsx";
import { BottomSheetTitle } from "../../ui/bottom-sheet/bottom-sheet-title.tsx";
import { SnowflakeIcon } from "lucide-react";

export function FreezeCardsScreen() {
  const [store] = useState(() => new FreezeCardsStore());
  const { form } = store;

  useBackButton(() => {
    screenStore.back();
  });

  useMainButton(
    t("freeze_title"),
    store.freeze,
    () => store.isFreezeButtonVisible,
  );
  useProgress(() => store.cardsFreezeRequest.isLoading);

  return (
    <Screen title={t("freeze_title")}>
      <List
        items={[
          {
            text: t("how"),
            icon: (
              <FilledIcon
                backgroundColor={theme.icons.turquoise}
                icon={<SnowflakeIcon size={18} />}
              />
            ),
            onClick: () => {
              store.isHowOpen.setTrue();
            },
          },
        ]}
      />

      <div className="self-center text-center flex flex-col gap-1 text-hint w-full text-sm">
        <span>{t("freeze_for")}</span>
        <Flex gap={8}>
          {[1, 3, 5].map((days) => {
            return (
              <Chip
                key={days}
                fullWidth
                isSelected={form.freezeCardSelect.value === days}
                onClick={() => form.freezeCardSelect.onChange(days)}
              >
                {formatDays(days)}
              </Chip>
            );
          })}
        </Flex>
        <span>{t("freeze_for_or_manual")}</span>
        <Input field={form.freezeCardInput} />
      </div>
      {store.freezeDays ? (
        <div className="text-hint self-center text-sm">
          {t("freeze_notified")}{" "}
          {DateTime.now()
            .plus({ days: store.freezeDays + 1 })
            .toLocaleString(DateTime.DATE_HUGE)}
        </div>
      ) : null}

      <BottomSheet
        isOpen={store.isHowOpen.value}
        onClose={store.isHowOpen.setFalse}
      >
        <BottomSheetTitle title={t("how")} onClose={store.isHowOpen.setFalse} />
        <ul className="pl-6">
          {[
            t("freeze_rule_1"),
            t("freeze_rule_2"),
            t("freeze_rule_3"),
            t("freeze_rule_4"),
          ].map((item, i) => {
            return <li key={i}>{item}</li>;
          })}
        </ul>
      </BottomSheet>
    </Screen>
  );
}
