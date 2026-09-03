import { makeAutoObservable } from "mobx";
import { api, apiProxy } from "../../../api/trpc-api.ts";
import { type RouterOutput } from "api";
import { makeInfiniteQuery } from "../../../lib/mobx-query-lite/make-infinite-query.ts";
import { makeQuery } from "../../../lib/mobx-query-lite/make-query.ts";
import { getTz } from "../../../lib/platform/get-tz.ts";
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

type DailyReview = RouterOutput["myStatisticsReviewDays"]["items"][number];

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

export const getPaddedHeatmap = (
  reviewDays: DailyReview[],
  today: string,
  hasMoreReviewDays: boolean,
) => {
  const todayDate = parseIsoDate(today);
  const recentStartDate = subDays(
    subWeeks(todayDate, 13),
    getISODay(todayDate) - 1,
  );
  const oldestLoadedDay = reviewDays.at(-1);

  let startDateValue = recentStartDate;
  if (hasMoreReviewDays && oldestLoadedDay) {
    const oldestLoadedDate = parseIsoDate(oldestLoadedDay.date);
    startDateValue = addDays(
      oldestLoadedDate,
      (8 - getISODay(oldestLoadedDate)) % 7,
    );
  } else if (oldestLoadedDay) {
    const firstReviewDate = parseIsoDate(oldestLoadedDay.date);
    const firstReviewWeekStart = subDays(
      firstReviewDate,
      getISODay(firstReviewDate) - 1,
    );
    if (firstReviewWeekStart < recentStartDate) {
      startDateValue = firstReviewWeekStart;
    }
  }
  const startDate = formatIsoDate(startDateValue);

  const daysByDate = new Map(
    reviewDays
      .filter((day) => day.date >= startDate)
      .map((day) => [day.date, day]),
  );
  const daysCount = differenceInCalendarDays(todayDate, startDateValue) + 1;

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
  reviewDaysQuery = makeInfiniteQuery({
    key: "userStatistics.reviewDays",
    query: ({ cursor }) =>
      api.myStatisticsReviewDays.query({
        timeZone: getTz(),
        cursor,
      }),
  });

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get reviewDays() {
    return this.reviewDaysQuery.items;
  }

  get maxReviewsInHeatmap() {
    return Math.max(0, ...this.heatmap.map((day) => day.reviews));
  }

  get hasActivity() {
    return this.reviewDays.some((day) => day.reviews > 0);
  }

  get shouldShowHeatmapEmptyText() {
    return (
      this.reviewDaysQuery.data !== undefined &&
      !this.reviewDaysQuery.hasNextPage &&
      !this.hasActivity
    );
  }

  get canFetchMoreReviewDays() {
    return (
      this.reviewDaysQuery.hasNextPage &&
      !this.reviewDaysQuery.isFetchingNextPage
    );
  }

  get heatmap() {
    return getPaddedHeatmap(
      this.reviewDays,
      getTodayDate(),
      this.reviewDaysQuery.hasNextPage,
    );
  }

  get heatmapWeeks() {
    const weeks = [];

    for (let index = 0; index < this.heatmap.length; index += 7) {
      weeks.push(this.heatmap.slice(index, index + 7));
    }

    return weeks;
  }

  getHeatmapIntensity(reviews: number) {
    return getReviewIntensity(reviews, this.maxReviewsInHeatmap);
  }
}
