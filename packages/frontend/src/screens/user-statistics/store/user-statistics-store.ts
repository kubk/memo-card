import { makeAutoObservable } from "mobx";
import { RequestStore } from "../../../lib/mobx-request/request-store.ts";
import { api } from "../../../api/trpc-api.ts";
import { MyStatisticsResponse } from "api";

export class UserStatisticsStore {
  userStatisticsRequest = new RequestStore<
    MyStatisticsResponse,
    [input: { timeZone: string }]
  >(api.myStatistics.query);

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  load() {
    this.userStatisticsRequest.execute({
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
  }

  get statistics(): MyStatisticsResponse | null {
    if (this.userStatisticsRequest.result.status !== "success") {
      return null;
    }

    return this.userStatisticsRequest.result.data;
  }

  get heatmap() {
    return this.statistics?.heatmap ?? [];
  }

  get maxReviewsInDay() {
    return Math.max(0, ...this.heatmap.map((day) => day.reviews));
  }

  get hasActivity() {
    return this.heatmap.some((day) => day.reviews > 0);
  }

  get recentHeatmap() {
    return this.heatmap.slice(-98);
  }

  get heatmapWeeks() {
    const weeks = [];

    for (let index = 0; index < this.recentHeatmap.length; index += 7) {
      weeks.push(this.recentHeatmap.slice(index, index + 7));
    }

    return weeks;
  }

  getHeatmapIntensity(reviews: number) {
    if (reviews === 0 || this.maxReviewsInDay === 0) {
      return 0;
    }

    return Math.max(1, Math.ceil((reviews / this.maxReviewsInDay) * 4));
  }
}
