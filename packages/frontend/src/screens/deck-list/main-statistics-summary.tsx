import { useMemo, useState } from "react";
import { RouterOutput } from "api";
import { ChevronRightIcon, FlameIcon } from "lucide-react";
import { api } from "../../api/trpc-api.ts";
import { RequestStore } from "../../lib/mobx-request/request-store.ts";
import { useMount } from "../../lib/react/use-mount.ts";
import { platform } from "../../lib/platform/platform.ts";
import { screenStore } from "../../store/screen-store.ts";
import { userStore } from "../../store/user-store.ts";
import { cn } from "../../ui/cn.ts";
import { translator } from "../../translations/t.ts";
import { formatDays } from "../../translations/format-days.ts";

const weekCellColors = [
  "bg-[rgba(120,120,120,0.12)]",
  "bg-[#bcefc7]",
  "bg-[#73d889]",
  "bg-[#2ecb47]",
  "bg-[#139e2d]",
];

function parseIsoDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatWeekday(date: string) {
  return new Intl.DateTimeFormat(translator.getLang(), {
    weekday: "narrow",
  })
    .format(parseIsoDate(date))
    .toLocaleUpperCase();
}

function getWeekCellIntensity(reviews: number, maxReviewsInDay: number) {
  if (reviews === 0 || maxReviewsInDay === 0) {
    return 0;
  }

  return Math.max(1, Math.ceil((reviews / maxReviewsInDay) * 4));
}

function MainStatisticsSummaryLoading() {
  return (
    <div className="bg-bg rounded-xl px-3 py-3 animate-pulse">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="h-7 w-7 rounded-lg bg-secondary-bg" />
          <div className="h-5 w-28 rounded bg-secondary-bg" />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 7 }).map((_, index) => (
              <div key={index} className="flex flex-col items-center gap-1">
                <div className="h-3 w-3 rounded bg-secondary-bg" />
                <div className="h-4 w-4 rounded-[3px] bg-secondary-bg" />
              </div>
            ))}
          </div>
          <div className="h-[22px] w-[22px] shrink-0" />
        </div>
      </div>
    </div>
  );
}

export function MainStatisticsSummary() {
  const [summaryRequest] = useState(
    () =>
      new RequestStore<
        RouterOutput["myStatisticsSummary"],
        [input: { timeZone: string }]
      >(api.myStatisticsSummary.query),
  );

  useMount(() => {
    summaryRequest.execute({
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
  });

  if (summaryRequest.result.status === "loading") {
    return <MainStatisticsSummaryLoading />;
  }

  if (summaryRequest.result.status !== "success") {
    return null;
  }

  return <MainStatisticsSummaryContent summary={summaryRequest.result.data} />;
}

function MainStatisticsSummaryContent(props: {
  summary: RouterOutput["myStatisticsSummary"];
}) {
  const { summary } = props;
  const maxReviewsInDay = useMemo(
    () => Math.max(0, ...summary.week.map((day) => day.reviews)),
    [summary.week],
  );

  return (
    <button
      type="button"
      className={cn(
        "w-full border-0 bg-bg rounded-xl px-3 py-3 cursor-pointer text-text",
        "active:scale-[0.98] active:transition-transform active:duration-300 active:origin-center",
      )}
      onClick={() => {
        platform.haptic("selection");
        screenStore.go({ type: "userStatistics" });
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <FlameIcon
            size={28}
            className="shrink-0 text-orange"
            fill="currentColor"
          />
          <div className="min-w-0 text-start text-[15px] font-semibold leading-5">
            <span className="tabular-nums">
              {formatDays(summary.currentStreak)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="grid grid-cols-7 gap-2">
            {summary.week.map((day) => (
              <div key={day.date} className="flex flex-col items-center gap-1">
                <div className="text-[11px] font-medium leading-3 text-hint">
                  {formatWeekday(day.date)}
                </div>
                <div
                  className={cn(
                    "h-4 w-4 rounded-[3px]",
                    weekCellColors[
                      getWeekCellIntensity(day.reviews, maxReviewsInDay)
                    ],
                  )}
                />
              </div>
            ))}
          </div>
          <ChevronRightIcon
            size={22}
            className={cn(
              "text-hint shrink-0",
              userStore.isRtl && "rotate-180",
            )}
          />
        </div>
      </div>
    </button>
  );
}
