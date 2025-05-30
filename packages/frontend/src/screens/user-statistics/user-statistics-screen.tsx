import { Screen } from "../shared/screen.tsx";
import { useMount } from "../../lib/react/use-mount.ts";
import { useUserStatisticsStore } from "./store/user-statistics-store-context.tsx";
import { useBackButton } from "../../lib/platform/use-back-button.ts";
import { screenStore } from "../../store/screen-store.ts";
import { CardRow } from "../../ui/card-row.tsx";
import { HintTransparent } from "../../ui/hint-transparent.tsx";
import { t } from "../../translations/t.ts";
import {
  chartFinish,
  chartStart,
  PieChartCanvas,
} from "./pie-chart-canvas.tsx";
import { LegendItem } from "./legend-item.tsx";
import { CardRowLoading } from "../shared/card-row-loading.tsx";
import { EmptyStudyFrequencyChartText } from "./empty-study-frequency-chart-text.tsx";
import { Flex } from "../../ui/flex.tsx";

const pieChartWidth = 250;
const pieChartHeight = 200;

export function UserStatisticsScreen() {
  const userStatisticsStore = useUserStatisticsStore();

  useBackButton(() => {
    screenStore.back();
  });

  useMount(() => {
    userStatisticsStore.load();
  });

  return (
    <Screen title={t("user_stats_page")}>
      {userStatisticsStore.userStatisticsRequest.isLoading ? (
        <CardRowLoading speed={1} />
      ) : (
        <CardRow>
          <span>{t("user_stats_remembered")}</span>
          <span>{userStatisticsStore.know}</span>
        </CardRow>
      )}
      <HintTransparent>{t("user_stats_remembered_hint")}</HintTransparent>

      {userStatisticsStore.userStatisticsRequest.isLoading ? (
        <CardRowLoading speed={1} />
      ) : (
        <CardRow>
          <span>{t("user_stats_learning")}</span>
          <span>{userStatisticsStore.learning}</span>
        </CardRow>
      )}
      <HintTransparent>{t("user_stats_learning_hint")}</HintTransparent>

      {userStatisticsStore.userStatisticsRequest.isLoading ? (
        <CardRowLoading speed={1} />
      ) : (
        <CardRow>
          <span>{t("user_stats_total")}</span>
          <span>{userStatisticsStore.total}</span>
        </CardRow>
      )}
      <HintTransparent>{t("user_stats_total_hint")}</HintTransparent>

      {!userStatisticsStore.userStatisticsRequest.isLoading ? (
        <>
          <div className="mt-[10px] mx-auto text-center font-medium">
            {t("user_stats_learning_time")}
          </div>

          <div className="mt-[10px] mx-auto relative">
            {userStatisticsStore.isFrequencyChartEmpty ? (
              <div className="blur-[5px]">
                <PieChartCanvas
                  data={[
                    { interval_range: "1-2", frequency: 10 },
                    { interval_range: "3-4", frequency: 20 },
                    { interval_range: "5-6", frequency: 30 },
                    { interval_range: "7-8", frequency: 10 },
                    { interval_range: "9-10", frequency: 20 },
                  ]}
                  width={pieChartWidth}
                  height={pieChartHeight}
                />
              </div>
            ) : (
              <PieChartCanvas
                data={userStatisticsStore.frequencyChart}
                width={pieChartWidth}
                height={pieChartHeight}
              />
            )}

            {userStatisticsStore.isFrequencyChartEmpty && (
              <EmptyStudyFrequencyChartText />
            )}
          </div>

          {!userStatisticsStore.isFrequencyChartEmpty && (
            <>
              <Flex direction={"column"} gap={4} alignSelf={"center"}>
                <Flex gap={4} alignItems={"center"}>
                  <LegendItem color={chartStart} />
                  <span className="text-[14px]">
                    {t("user_stats_chart_min_expl")}
                  </span>
                </Flex>

                <Flex gap={4} alignItems={"center"}>
                  <LegendItem color={chartFinish} />
                  <span className="text-[14px]">
                    {t("user_stats_chart_max_expl")}
                  </span>
                </Flex>
              </Flex>
              <p>
                <HintTransparent>
                  {t("user_stats_learning_time_hint")}
                </HintTransparent>
              </p>
            </>
          )}
        </>
      ) : null}
    </Screen>
  );
}
