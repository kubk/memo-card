import { Screen } from "../shared/screen.tsx";
import { useMount } from "../../lib/react/use-mount.ts";
import { useUserStatisticsStore } from "./store/user-statistics-store-context.tsx";
import { useBackButton } from "../../lib/platform/use-back-button.ts";
import { screenStore } from "../../store/screen-store.ts";
import { t } from "../../translations/t.ts";
import { CardRowLoading } from "../shared/card-row-loading.tsx";
import { cn } from "../../ui/cn.ts";
import { type ReactNode } from "react";
import { List } from "../../ui/list.tsx";
import { FilledIcon } from "../../ui/filled-icon.tsx";
import { FlameIcon, TrophyIcon } from "lucide-react";
import { formatDays } from "../../translations/format-days.ts";
import { ListHeader } from "../../ui/list-header.tsx";

const heatmapColors = [
  "bg-[rgba(120,120,120,0.12)]",
  "bg-[#bcefc7]",
  "bg-[#73d889]",
  "bg-[#2ecb47]",
  "bg-[#139e2d]",
];

function StatTile(props: { label: string; value: string | number }) {
  return (
    <div className="bg-bg rounded-lg px-3 py-2 min-w-0">
      <div className="text-[12px] text-hint leading-4 truncate">
        {props.label}
      </div>
      <div className="text-[24px] font-semibold leading-7 tabular-nums">
        {props.value}
      </div>
    </div>
  );
}

function Section(props: { title: string; children: ReactNode }) {
  return (
    <section className="mt-2">
      <ListHeader text={props.title} />
      {props.children}
    </section>
  );
}

export function UserStatisticsScreen() {
  const userStatisticsStore = useUserStatisticsStore();
  const statistics = userStatisticsStore.statistics;

  useBackButton(() => {
    screenStore.back();
  });

  useMount(() => {
    userStatisticsStore.load();
  });

  return (
    <Screen title={t("user_stats_page")}>
      {userStatisticsStore.userStatisticsRequest.isLoading ? (
        <>
          <CardRowLoading speed={1} />
          <CardRowLoading speed={1} />
          <CardRowLoading speed={1} />
        </>
      ) : statistics ? (
        <>
          <Section title={t("user_stats_streaks")}>
            <List
              items={[
                {
                  text: t("user_stats_best_streak"),
                  icon: (
                    <FilledIcon
                      backgroundColor="#f4b400"
                      icon={<TrophyIcon size={18} className="text-white" />}
                    />
                  ),
                  right: (
                    <span className="font-medium tabular-nums">
                      {formatDays(statistics.activity.bestStreak)}
                    </span>
                  ),
                },
                {
                  text: t("user_stats_current_streak"),
                  icon: (
                    <FilledIcon
                      backgroundColor="#ff8a00"
                      icon={<FlameIcon size={18} className="text-white" />}
                    />
                  ),
                  right: (
                    <span className="font-medium tabular-nums">
                      {formatDays(statistics.activity.currentStreak)}
                    </span>
                  ),
                },
              ]}
            />
          </Section>

          <Section title={t("user_stats_card_reviews")}>
            <div className="grid grid-cols-3 gap-2">
              <StatTile
                label={t("user_stats_today")}
                value={statistics.activity.todayReviews}
              />
              <StatTile
                label={t("user_stats_7d")}
                value={statistics.activity.last7DaysReviews}
              />
              <StatTile
                label={t("user_stats_30d")}
                value={statistics.activity.last30DaysReviews}
              />
            </div>

            <div className="mt-2 bg-bg rounded-lg p-3">
              <div className="grid grid-cols-[repeat(14,minmax(0,1fr))] gap-[3px]">
                {userStatisticsStore.heatmapWeeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-[3px]">
                    {week.map((day) => (
                      <div
                        key={day.date}
                        title={`${day.date}: ${day.reviews}`}
                        className={cn(
                          "aspect-square rounded-[3px]",
                          heatmapColors[
                            userStatisticsStore.getHeatmapIntensity(day.reviews)
                          ],
                        )}
                      />
                    ))}
                  </div>
                ))}
              </div>

              {!userStatisticsStore.hasActivity && (
                <div className="mt-3 text-center text-[13px] text-hint">
                  {t("user_stats_empty_text")}
                </div>
              )}
            </div>
          </Section>

          <Section title={t("user_stats_memory")}>
            <div className="grid grid-cols-3 gap-2">
              <StatTile
                label={t("user_stats_to_review")}
                value={statistics.overview.dueNow}
              />
              <StatTile
                label={t("user_stats_remembered_cards")}
                value={statistics.overview.remembered}
              />
              <StatTile
                label={t("user_stats_all_cards")}
                value={statistics.overview.totalReviewedCards}
              />
            </div>
          </Section>
        </>
      ) : null}
    </Screen>
  );
}
