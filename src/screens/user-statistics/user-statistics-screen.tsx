import { Screen } from "../shared/screen.tsx";
import { observer } from "mobx-react-lite";
import { useMount } from "../../lib/react/use-mount.ts";
import { useUserStatisticsStore } from "./store/user-statistics-store-context.tsx";
import { useBackButton } from "../../lib/telegram/use-back-button.tsx";
import { screenStore } from "../../store/screen-store.ts";
import { CardRow } from "../../ui/card-row.tsx";
import { HintTransparent } from "../../ui/hint-transparent.tsx";
import React from "react";
import { css } from "@emotion/css";
import { t } from "../../translations/t.ts";
import {
  chartFinish,
  chartStart,
  PieChartCanvas,
} from "./pie-chart-canvas.tsx";
import { LegendItem } from "./legend-item.tsx";
import { DeckLoading } from "../shared/deck-loading.tsx";

export const UserStatisticsScreen = observer(() => {
  const userStatisticsStore = useUserStatisticsStore();

  useBackButton(() => {
    screenStore.back();
  });

  useMount(() => {
    userStatisticsStore.load();
  });

  return (
    <Screen title={t("user_stats_page")}>
      {userStatisticsStore.isLoading ? (
        <DeckLoading speed={1} />
      ) : (
        <CardRow>
          <span>{t("user_stats_remembered")}</span>
          <span>{userStatisticsStore.know}</span>
        </CardRow>
      )}
      <HintTransparent>{t("user_stats_remembered_hint")}</HintTransparent>

      {userStatisticsStore.isLoading ? (
        <DeckLoading speed={1} />
      ) : (
        <CardRow>
          <span>{t("user_stats_learning")}</span>
          <span>{userStatisticsStore.learning}</span>
        </CardRow>
      )}
      <HintTransparent>{t("user_stats_learning_hint")}</HintTransparent>

      {userStatisticsStore.isLoading ? (
        <DeckLoading speed={1} />
      ) : (
        <CardRow>
          <span>{t("user_stats_total")}</span>
          <span>{userStatisticsStore.total}</span>
        </CardRow>
      )}
      <HintTransparent>{t("user_stats_total_hint")}</HintTransparent>

      {!userStatisticsStore.isLoading ? (
        <>
          <div
            className={css({
              marginTop: 10,
              marginLeft: "auto",
              marginRight: "auto",
              textAlign: "center",
              fontWeight: 500,
            })}
          >
            {t("user_stats_learning_time")}
          </div>

          <div
            className={css({
              marginTop: 10,
              marginLeft: "auto",
              marginRight: "auto",
            })}
          >
            <PieChartCanvas
              data={userStatisticsStore.frequencyChart}
              width={250}
              height={200}
            />
          </div>

          <div
            className={css({
              display: "flex",
              flexDirection: "column",
              gap: 4,
              alignSelf: "center",
            })}
          >
            <div
              className={css({ display: "flex", gap: 4, alignItems: "center" })}
            >
              <LegendItem color={chartStart} />
              <span className={css({ fontSize: 14 })}>
                {t("user_stats_chart_min_expl")}
              </span>
            </div>
            <div
              className={css({ display: "flex", gap: 4, alignItems: "center" })}
            >
              <LegendItem color={chartFinish} />
              <span className={css({ fontSize: 14 })}>
                {t("user_stats_chart_max_expl")}
              </span>
            </div>
          </div>
          <p>
            <HintTransparent>
              {t("user_stats_learning_time_hint")}
            </HintTransparent>
          </p>
        </>
      ) : null}
    </Screen>
  );
});
