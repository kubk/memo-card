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
import { translator } from "../../translations/t.ts";
import { ChevronIcon } from "../../ui/chevron-icon.tsx";
import { formatNumber } from "../../translations/format-number.ts";
import { useBottomReached } from "../../lib/react/use-bottom-reached.ts";

const heatmapColors = [
  "bg-[rgba(120,120,120,0.12)]",
  "bg-[#bcefc7]",
  "bg-[#73d889]",
  "bg-[#2ecb47]",
  "bg-[#139e2d]",
];

function formatDailyStatsDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);

  return new Intl.DateTimeFormat(translator.getLang(), {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}

function StatisticsLoading() {
  return (
    <>
      <CardRowLoading speed={1} />
      <CardRowLoading speed={1} />
      <CardRowLoading speed={1} />
    </>
  );
}

function StatisticsLoadError() {
  return (
    <div className="rounded-xl bg-bg px-4 py-5 text-center text-[14px] leading-5 text-hint">
      {t("error_contact_support")}
    </div>
  );
}

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

function Section(props: {
  title: string;
  children: ReactNode;
  rightSlot?: ReactNode;
}) {
  return (
    <section className="mt-2">
      <ListHeader text={props.title} rightSlot={props.rightSlot} />
      {props.children}
    </section>
  );
}

function DailyStatsMarker(props: { reviews: number }) {
  const userStatisticsStore = useUserStatisticsStore();

  return (
    <div
      className={cn(
        "h-[30px] w-[30px] shrink-0 rounded-lg",
        heatmapColors[userStatisticsStore.getDailyListIntensity(props.reviews)],
      )}
    />
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
        <StatisticsLoading />
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

          <Section
            title={t("user_stats_card_reviews")}
            rightSlot={
              <button
                type="button"
                className="absolute top-1 end-1 flex shrink-0 items-center gap-1 text-sm uppercase text-link"
                onClick={() => {
                  screenStore.push({ type: "userStatisticsDaily" });
                }}
              >
                {t("teacher_stats_see_all")}
                <ChevronIcon direction="right" />
              </button>
            }
          >
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

            <button
              type="button"
              title={t("user_stats_daily_page")}
              className="mt-2 w-full cursor-pointer rounded-lg border-0 bg-bg p-3 text-start text-text active:scale-[0.99] active:transition-transform active:duration-300"
              onClick={() => {
                screenStore.push({ type: "userStatisticsDaily" });
              }}
            >
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
            </button>
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
      ) : (
        <StatisticsLoadError />
      )}
    </Screen>
  );
}

export function UserStatisticsDailyScreen() {
  const userStatisticsStore = useUserStatisticsStore();
  const days = userStatisticsStore.dailyReviews;

  useBackButton(() => {
    screenStore.back();
  });

  useMount(() => {
    userStatisticsStore.loadDailyReviews();
  });

  useBottomReached(
    () => {
      userStatisticsStore.dailyReviewsRequest.loadMore();
    },
    {
      enabled:
        userStatisticsStore.dailyReviewsRequest.hasLoaded &&
        !userStatisticsStore.dailyReviewsRequest.isInitialLoading,
    },
  );

  return (
    <Screen title={t("user_stats_daily_page")}>
      {userStatisticsStore.dailyReviewsRequest.isInitialLoading ? (
        <StatisticsLoading />
      ) : userStatisticsStore.dailyReviewsRequest.loadError &&
        days.length === 0 ? (
        <StatisticsLoadError />
      ) : userStatisticsStore.dailyReviewsRequest.hasLoaded ? (
        <>
          <List
            items={days.map((day) => ({
              text: (
                <span className="inline-flex items-baseline gap-1">
                  <span>{t("teacher_stats_repeats")}:</span>
                  <span className="font-semibold tabular-nums">
                    {formatNumber(day.reviews)}
                  </span>
                </span>
              ),
              icon: <DailyStatsMarker reviews={day.reviews} />,
              right: (
                <span className="text-sm text-hint">
                  {formatDailyStatsDate(day.date)}
                </span>
              ),
            }))}
          />
          {userStatisticsStore.dailyReviewsRequest.isLoadingMore && (
            <CardRowLoading speed={1} />
          )}
        </>
      ) : (
        <StatisticsLoadError />
      )}
    </Screen>
  );
}
