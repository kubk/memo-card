import { Screen } from "../shared/screen.tsx";
import { useUserStatisticsStore } from "./store/user-statistics-store-context.tsx";
import { useBackButton } from "../../lib/platform/use-back-button.ts";
import { screenStore } from "../../store/screen-store.ts";
import { t } from "../../translations/t.ts";
import { CardRowLoading } from "../shared/card-row-loading.tsx";
import { cn } from "../../ui/cn.ts";
import { type ReactNode, useLayoutEffect, useRef } from "react";
import { List } from "../../ui/list.tsx";
import { FilledIcon } from "../../ui/filled-icon.tsx";
import { FlameIcon, LoaderCircleIcon, TrophyIcon } from "lucide-react";
import { formatDays } from "../../translations/format-days.ts";
import { LabelGroup } from "../../ui/label-group.tsx";
import { translator } from "../../translations/t.ts";
import { ChevronIcon } from "../../ui/chevron-icon.tsx";
import { formatNumber } from "../../translations/format-number.ts";
import { useBottomReached } from "../../lib/react/use-bottom-reached.ts";
import { type RouterOutput } from "api";
import { BackBottomButton } from "../shared/back-bottom-button.tsx";

const heatmapColors = [
  "bg-[rgba(120,120,120,0.12)]",
  "bg-[#bcefc7]",
  "bg-[#73d889]",
  "bg-[#2ecb47]",
  "bg-[#139e2d]",
];

type UserStatistics = RouterOutput["myStatistics"];

function formatDailyStatsDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);

  return new Intl.DateTimeFormat(translator.getLang(), {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}

function NumberSkeleton(props: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-block h-7 w-12 animate-pulse rounded bg-secondary-bg align-middle",
        props.className,
      )}
    />
  );
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

function StreakValue(props: { days: number | undefined }) {
  return (
    <span className="inline-flex min-w-[72px] justify-end font-medium tabular-nums">
      {props.days === undefined ? (
        <NumberSkeleton className="h-[18px] w-16" />
      ) : (
        formatDays(props.days)
      )}
    </span>
  );
}

function StatTile(props: {
  label: string;
  value: string | number | undefined;
}) {
  return (
    <div className="bg-bg rounded-lg px-3 py-2 min-w-0">
      <div className="text-[12px] text-hint leading-4 truncate">
        {props.label}
      </div>
      <div className="min-h-7 text-[24px] font-semibold leading-7 tabular-nums">
        {props.value === undefined ? (
          <NumberSkeleton className="h-6" />
        ) : (
          props.value
        )}
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
      <LabelGroup title={props.title} slotRight={props.rightSlot}>
        {props.children}
      </LabelGroup>
    </section>
  );
}

function Heatmap() {
  const userStatisticsStore = useUserStatisticsStore();
  const heatmapElement = useRef<HTMLDivElement>(null);
  const scrollAnchor = useRef<number | null>(null);

  useLayoutEffect(() => {
    const element = heatmapElement.current;
    if (element) {
      if (scrollAnchor.current === null) {
        element.scrollLeft = element.scrollWidth;
      } else {
        element.scrollLeft = element.scrollWidth - scrollAnchor.current;
        scrollAnchor.current = null;
      }
    }
  }, [userStatisticsStore.heatmapWeeks.length]);

  return (
    <div className="mt-2 w-full rounded-lg bg-bg p-3 text-start text-text">
      <div className="relative">
        <div
          ref={heatmapElement}
          dir="ltr"
          className="overflow-x-auto"
          onScroll={(event) => {
            const element = event.currentTarget;
            if (
              element.scrollLeft <= 1 &&
              userStatisticsStore.canFetchMoreReviewDays
            ) {
              scrollAnchor.current = element.scrollWidth - element.scrollLeft;
              userStatisticsStore.reviewDaysQuery.fetchNextPage();
            }
          }}
        >
          <div className="flex min-w-full gap-[3px]">
            {userStatisticsStore.heatmapWeeks.map((week, weekIndex) => (
              <div
                key={weekIndex}
                className="flex w-[calc((100%_-_39px)_/_14)] shrink-0 flex-col gap-[3px]"
              >
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
        </div>

        {userStatisticsStore.reviewDaysQuery.isFetchingNextPage ? (
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex w-11 items-center justify-center">
            <LoaderCircleIcon
              size={32}
              strokeWidth={2.5}
              className="animate-spin text-link"
            />
          </div>
        ) : null}
      </div>

      {userStatisticsStore.shouldShowHeatmapEmptyText ? (
        <div className="mt-3 text-center text-[13px] leading-5 text-hint">
          {t("user_stats_empty_text")}
        </div>
      ) : null}
    </div>
  );
}

function DailyStatsMarker(props: { reviews: number }) {
  const userStatisticsStore = useUserStatisticsStore();

  return (
    <div
      className={cn(
        "h-[30px] w-[30px] shrink-0 rounded-lg",
        heatmapColors[userStatisticsStore.getHeatmapIntensity(props.reviews)],
      )}
    />
  );
}

function UserStatisticsContent(props: {
  statistics: UserStatistics | undefined;
}) {
  const { statistics } = props;
  return (
    <>
      <Section title={t("user_stats_streaks")}>
        <List
          items={[
            {
              text: t("user_stats_best_streak"),
              icon: (
                <FilledIcon
                  className="bg-[#f4b400]"
                  icon={<TrophyIcon size={18} className="text-white" />}
                />
              ),
              right: <StreakValue days={statistics?.activity.bestStreak} />,
            },
            {
              text: t("user_stats_current_streak"),
              icon: (
                <FilledIcon
                  className="bg-[#ff8a00]"
                  icon={<FlameIcon size={18} className="text-white" />}
                />
              ),
              right: <StreakValue days={statistics?.activity.currentStreak} />,
            },
          ]}
        />
      </Section>

      <Section
        title={t("user_stats_card_reviews")}
        rightSlot={
          <button
            type="button"
            className="flex shrink-0 items-center gap-1 text-sm uppercase text-link"
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
            value={statistics?.activity.todayReviews}
          />
          <StatTile
            label={t("user_stats_7d")}
            value={statistics?.activity.last7DaysReviews}
          />
          <StatTile
            label={t("user_stats_30d")}
            value={statistics?.activity.last30DaysReviews}
          />
        </div>

        <Heatmap />
      </Section>

      <Section title={t("user_stats_memory")}>
        <div className="grid grid-cols-3 gap-2">
          <StatTile
            label={t("user_stats_to_review")}
            value={statistics?.overview.dueNow}
          />
          <StatTile
            label={t("user_stats_remembered_cards")}
            value={statistics?.overview.remembered}
          />
          <StatTile
            label={t("user_stats_all_cards")}
            value={statistics?.overview.totalReviewedCards}
          />
        </div>
      </Section>
    </>
  );
}

export function UserStatisticsScreen() {
  const userStatisticsQuery = useUserStatisticsStore().userStatisticsQuery;
  const statistics = userStatisticsQuery.data;

  const handleBack = () => {
    screenStore.back();
  };

  useBackButton(handleBack);

  return (
    <>
      <Screen title={t("user_stats_page")}>
        {statistics || userStatisticsQuery.isPending ? (
          <UserStatisticsContent statistics={statistics} />
        ) : (
          <StatisticsLoadError />
        )}
      </Screen>

      <BackBottomButton onClick={handleBack} />
    </>
  );
}

export function UserStatisticsDailyScreen() {
  const userStatisticsStore = useUserStatisticsStore();

  useBackButton(() => {
    screenStore.back();
  });

  useBottomReached(userStatisticsStore.reviewDaysQuery.fetchNextPage, {
    enabled: userStatisticsStore.canFetchMoreReviewDays,
  });

  return (
    <Screen title={t("user_stats_daily_page")}>
      {userStatisticsStore.reviewDaysQuery.isPending ? (
        <StatisticsLoading />
      ) : userStatisticsStore.reviewDaysQuery.data !== undefined ? (
        <>
          <List
            items={userStatisticsStore.reviewDays.map((day) => ({
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
          {userStatisticsStore.reviewDaysQuery.isFetchingNextPage && (
            <div className="flex justify-center py-3">
              <LoaderCircleIcon size={24} className="animate-spin text-hint" />
            </div>
          )}
        </>
      ) : (
        <StatisticsLoadError />
      )}
    </Screen>
  );
}
