import { makeAutoObservable } from "mobx";
import { api, apiProxy } from "../../../api/trpc-api.ts";
import { type RouterOutput } from "api";
import { makeQuery } from "../../../lib/mobx-query-lite/make-query.ts";
import { getTz } from "../../../lib/platform/get-tz.ts";
import { makeInfiniteQuery } from "../../../lib/mobx-query-lite/make-infinite-query.ts";
import {
  addDays,
  differenceInCalendarDays,
  formatISO,
  getISODay,
  isValid,
  parseISO,
  subDays,
  subWeeks,
} from "date-fns";

const recentHeatmapDaysCount = 98;

type HeatmapReview = RouterOutput["myStatistics"]["heatmapReviews"][number];

const formatIsoDate = (date: Date) => {
  return formatISO(date, { representation: "date" });
};

const parseIsoDate = (value: string) => {
  const date = parseISO(value);
  if (!isValid(date) || formatIsoDate(date) !== value) {
    throw new Error(`Invalid heatmap date: ${value}`);
  }

  return date;
};

const addDaysToIsoDate = (date: string, days: number) => {
  return formatIsoDate(addDays(parseIsoDate(date), days));
};

const getTodayDate = () => {
  return formatIsoDate(new Date());
};

export const getPaddedRecentHeatmap = (
  heatmapReviews: HeatmapReview[],
  today: string,
) => {
  const todayDate = parseIsoDate(today);
  const startDateValue = subDays(
    subWeeks(todayDate, 13),
    getISODay(todayDate) - 1,
  );
  const startDate = formatIsoDate(startDateValue);

  const daysByDate = new Map(
    heatmapReviews
      .filter((day) => day.date >= startDate && day.date <= today)
      .map((day) => [day.date, day]),
  );
  const daysCount = Math.min(
    recentHeatmapDaysCount,
    differenceInCalendarDays(todayDate, startDateValue) + 1,
  );

  return Array.from({ length: daysCount }, (_, index) => {
    const date = addDaysToIsoDate(startDate, index);
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
  userStatisticsQuery = makeQuery(
    apiProxy.myStatistics.query({ timeZone: getTz() }),
  );
  dailyReviewsQuery = makeInfiniteQuery({
    key: "userStatisticsDaily",
    query: ({ cursor }) =>
      api.myStatisticsDailyReviews.query({
        timeZone: getTz(),
        cursor,
      }),
  });

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get heatmapReviews() {
    return this.userStatisticsQuery.data?.heatmapReviews ?? [];
  }

  get maxReviewsInRecentHeatmap() {
    return Math.max(0, ...this.recentHeatmap.map((day) => day.reviews));
  }

  get maxReviewsInDailyList() {
    return Math.max(
      0,
      ...this.dailyReviewsQuery.items.map((day) => day.reviews),
    );
  }

  get hasActivity() {
    return this.heatmapReviews.some((day) => day.reviews > 0);
  }

  get recentHeatmap() {
    return getPaddedRecentHeatmap(this.heatmapReviews, getTodayDate());
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
