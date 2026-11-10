import { type RouterOutput } from "api";
import { ChevronRightIcon, FlameIcon } from "lucide-react";
import { apiProxy } from "../../api/trpc-api.ts";
import { platform } from "../../lib/platform/platform.ts";
import { screenStore } from "../../store/screen-store.ts";
import { userStore } from "../../store/user-store.ts";
import { cn } from "../../ui/cn.ts";
import { t, getActiveLanguage } from "../../translations/t.ts";
import { getTz } from "../../lib/platform/get-tz.ts";
import { makeQuery } from "mobx-query-lite";

const weekCellColors = [
  "bg-[rgba(120,120,120,0.12)]",
  "bg-[#bcefc7]",
  "bg-[#73d889]",
  "bg-[#2ecb47]",
  "bg-[#139e2d]",
];

export const weekHeatmapQuery = makeQuery(
  apiProxy.weekHeatmap.query({ timeZone: getTz() }),
  { staleTime: 0 },
);

function parseIsoDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day);
}

// Bigger text sizes or narrow screens don't fit the full label,
// so the streak shows just the number and the week cells tighten up
const rowClassName =
  "flex items-center justify-between gap-3 @max-[19.5rem]:gap-2";
const trailingClassName =
  "flex items-center gap-2 shrink-0 @max-[19.5rem]:min-w-0 @max-[19.5rem]:flex-1 @max-[19.5rem]:justify-end";
const daysClassName =
  "grid grid-cols-7 gap-2 @max-[19.5rem]:flex @max-[19.5rem]:w-full @max-[19.5rem]:max-w-40 @max-[19.5rem]:justify-between @max-[19.5rem]:gap-1";

function WeekHeatmapLoading() {
  return (
    <div className="@container bg-bg rounded-xl px-3 py-3 animate-pulse">
      <div className={rowClassName}>
        <div className="flex items-center gap-2 min-w-0">
          <div className="h-7 w-7 rounded-lg bg-secondary-bg" />
          <div className="h-5 w-28 rounded bg-secondary-bg @max-[19.5rem]:w-6" />
        </div>
        <div className={trailingClassName}>
          <div className={daysClassName}>
            {Array.from({ length: 7 }).map((_, index) => (
              <div key={index} className="flex flex-col items-center gap-1">
                <div className="h-3 w-3 rounded bg-secondary-bg" />
                <div className="h-4 w-4 rounded-[0.1875rem] bg-secondary-bg" />
              </div>
            ))}
          </div>
          <div className="h-5.5 w-5.5 shrink-0" />
        </div>
      </div>
    </div>
  );
}

export function WeekHeatmap() {
  const weekHeatmap = weekHeatmapQuery.data;

  if (weekHeatmapQuery.isPending) {
    return <WeekHeatmapLoading />;
  }

  if (!weekHeatmap) {
    return null;
  }

  return <WeekHeatmapContent weekHeatmap={weekHeatmap} />;
}

function WeekHeatmapContent(props: {
  weekHeatmap: RouterOutput["weekHeatmap"];
}) {
  const { weekHeatmap } = props;

  return (
    <button
      type="button"
      className={cn(
        "@container w-full border-0 bg-bg rounded-xl px-3 py-3 cursor-pointer text-text",
        "active:scale-[0.98] active:transition-transform active:duration-300 active:origin-center",
      )}
      onClick={() => {
        platform.haptic("selection");
        screenStore.push({ type: "userStatistics" });
      }}
    >
      <div className={rowClassName}>
        <div className="flex items-center gap-2 min-w-0">
          <FlameIcon
            className="size-7 shrink-0 text-orange"
            fill="currentColor"
          />
          <div className="min-w-0 text-start text-[0.9375rem] font-semibold leading-5">
            <span className="tabular-nums @max-[19.5rem]:hidden">
              {t("days_count", { days: weekHeatmap.currentStreak })}
            </span>
            <span className="hidden tabular-nums @max-[19.5rem]:inline">
              {weekHeatmap.currentStreak}
            </span>
          </div>
        </div>

        <div className={trailingClassName}>
          <div className={daysClassName}>
            {weekHeatmap.days.map((day) => {
              const weekday = new Intl.DateTimeFormat(getActiveLanguage(), {
                weekday: "narrow",
              })
                .format(parseIsoDate(day.date))
                .toLocaleUpperCase();

              return (
                <div
                  key={day.date}
                  className="flex flex-col items-center gap-1"
                >
                  <div className="text-[0.6875rem] font-medium leading-3 text-hint">
                    {weekday}
                  </div>
                  <div
                    className={cn(
                      "h-4 w-4 rounded-[0.1875rem]",
                      weekCellColors[day.intensity],
                    )}
                  />
                </div>
              );
            })}
          </div>
          <ChevronRightIcon
            className={cn(
              "size-5.5 text-hint shrink-0",
              userStore.isRtl && "rotate-180",
            )}
          />
        </div>
      </div>
    </button>
  );
}
