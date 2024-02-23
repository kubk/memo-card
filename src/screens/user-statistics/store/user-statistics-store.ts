import { makeAutoObservable } from "mobx";
import { fromPromise, IPromiseBasedObservable } from "mobx-utils";
import { MyStatisticsResponse } from "../../../../functions/my-statistics.ts";
import { myStatisticsRequest } from "../../../api/api.ts";
import { PieChartData } from "../pie-chart-canvas.tsx";

export class UserStatisticsStore {
  userStatistics?: IPromiseBasedObservable<MyStatisticsResponse>;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  load() {
    this.userStatistics = fromPromise(myStatisticsRequest());
  }

  get isLoading() {
    return this.userStatistics?.state === "pending";
  }

  get know() {
    if (this.userStatistics?.state !== "fulfilled") {
      return 0;
    }
    return this.userStatistics.value.cardsLearning.know ?? 0;
  }

  get learning() {
    if (this.userStatistics?.state !== "fulfilled") {
      return 0;
    }
    return this.userStatistics.value.cardsLearning.learning ?? 0;
  }

  get total() {
    return this.know + this.learning;
  }

  get frequencyChart(): PieChartData[] {
    if (this.userStatistics?.state !== "fulfilled") {
      return [];
    }

    return this.userStatistics.value.intervalFrequency;
  }
}
