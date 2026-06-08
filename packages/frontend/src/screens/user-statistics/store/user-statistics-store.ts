import { makeAutoObservable } from "mobx";
import { RequestStore } from "../../../lib/mobx-request/request-store.ts";
import { api } from "../../../api/trpc-api.ts";
import { type RouterOutput } from "api";
import { DateTime } from "luxon";

const recentHeatmapDaysCount = 98;

type HeatmapDay = RouterOutput["myStatistics"]["heatmap"][number];

const addDays = (date: string, days: number) => {
  const result = DateTime.fromISO(date, { zone: "utc" })
    .plus({ days })
    .toISODate();

  if (!result) {
    throw new Error(`Invalid heatmap date: ${date}`);
  }

  return result;
};

const getTodayDate = () => {
  const result = DateTime.local().toISODate();

  if (!result) {
    throw new Error("Invalid current date");
  }

  return result;
};

export const getPaddedRecentHeatmap = (
  heatmap: HeatmapDay[],
  today: string,
) => {
  const todayDate = DateTime.fromISO(today, { zone: "utc" });
  const startDate = todayDate
    .minus({ weeks: 13, days: todayDate.weekday - 1 })
    .toISODate();

  if (!startDate) {
    throw new Error(`Invalid heatmap date: ${today}`);
  }

  const daysByDate = new Map(
    heatmap
      .filter((day) => day.date >= startDate && day.date <= today)
      .map((day) => [day.date, day]),
  );
  const daysCount = Math.min(
    recentHeatmapDaysCount,
    Math.floor(
      todayDate.diff(DateTime.fromISO(startDate, { zone: "utc" }), "days").days,
    ) + 1,
  );

  return Array.from({ length: daysCount }, (_, index) => {
    const date = addDays(startDate, index);
    return daysByDate.get(date) ?? { date, reviews: 0 };
  });
};

const getReviewIntensity = (reviews: number, maxReviewsInDay: number) => {
  if (reviews === 0 || maxReviewsInDay === 0) {
    return 0;
  }

  return Math.max(1, Math.ceil((reviews / maxReviewsInDay) * 4));
};

export class UserStatisticsStore {
  userStatisticsRequest = new RequestStore<
    RouterOutput["myStatistics"],
    [input: { timeZone: string }]
  >(api.myStatistics.query, { staleWhileRevalidate: true });

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  load() {
    this.userStatisticsRequest.execute({
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
  }

  get statistics(): RouterOutput["myStatistics"] | null {
    if (this.userStatisticsRequest.result.status !== "success") {
      return null;
    }

    return this.userStatisticsRequest.result.data;
  }

  get heatmap() {
    return this.statistics?.heatmap ?? [];
  }

  get maxReviewsInRecentHeatmap() {
    return Math.max(0, ...this.recentHeatmap.map((day) => day.reviews));
  }

  get maxReviewsInDailyList() {
    return Math.max(0, ...this.heatmap.map((day) => day.reviews));
  }

  get hasActivity() {
    return this.heatmap.some((day) => day.reviews > 0);
  }

  get recentHeatmap() {
    return getPaddedRecentHeatmap(this.heatmap, getTodayDate());
  }

  get heatmapWeeks() {
    const weeks = [];

    for (let index = 0; index < this.recentHeatmap.length; index += 7) {
      weeks.push(this.recentHeatmap.slice(index, index + 7));
    }

    return weeks;
  }

  getHeatmapIntensity(reviews: number) {
    return getReviewIntensity(reviews, this.maxReviewsInRecentHeatmap);
  }

  getDailyListIntensity(reviews: number) {
    return getReviewIntensity(reviews, this.maxReviewsInDailyList);
  }
}
