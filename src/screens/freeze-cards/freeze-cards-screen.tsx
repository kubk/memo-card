import { observer } from "mobx-react-lite";
import { Screen } from "../shared/screen.tsx";
import { useBackButton } from "../../lib/telegram/use-back-button.tsx";
import { screenStore } from "../../store/screen-store.ts";
import { css } from "@emotion/css";
import { useState } from "react";
import { theme } from "../../ui/theme.tsx";
import { Flex } from "../../ui/flex.tsx";
import { useMainButton } from "../../lib/telegram/use-main-button.tsx";
import { Input } from "../../ui/input.tsx";
import { DateTime } from "luxon";
import { Chip } from "../../ui/chip.tsx";
import { FreezeCardsStore } from "./freeze-cards-store.ts";
import { FilledIcon } from "../../ui/filled-icon.tsx";
import { Accordion } from "../../ui/accordion.tsx";
import { useTelegramProgress } from "../../lib/telegram/use-telegram-progress.tsx";
import { t } from "../../translations/t.ts";
import { formatDays } from "./translations.ts";

export const FreezeCardsScreen = observer(() => {
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
  useTelegramProgress(() => store.isLoading);

  return (
    <Screen title={t("freeze_title")}>
      <Accordion
        title={
          <>
            <FilledIcon
              backgroundColor={theme.icons.turquoise}
              icon={"mdi-snowflake"}
            />
            {t("how")}
          </>
        }
        body={
          <>
            {t("freeze_how_title")}
            <ul className={css({ paddingLeft: 24 })}>
              {[
                t("freeze_rule_1"),
                t("freeze_rule_2"),
                t("freeze_rule_3"),
                t("freeze_rule_4"),
              ].map((item, i) => {
                return <li key={i}>{item}</li>;
              })}
            </ul>
          </>
        }
      />
      <div
        className={css({
          alignSelf: "center",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          gap: 4,
          color: theme.hintColor,
          width: "100%",
          fontSize: 14,
        })}
      >
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
        <div
          className={css({
            color: theme.hintColor,
            alignSelf: "center",
            fontSize: 14,
          })}
        >
          {t("freeze_notified")}{" "}
          {DateTime.now()
            .plus({ days: store.freezeDays + 1 })
            .toLocaleString(DateTime.DATE_HUGE)}
        </div>
      ) : null}
    </Screen>
  );
});
