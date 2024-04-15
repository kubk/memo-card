import { makeAutoObservable } from "mobx";
import { myStatisticsRequest } from "../../../api/api.ts";
import { PieChartData } from "../pie-chart-canvas.tsx";
import { RequestStore } from "../../../lib/mobx-request/request-store.ts";

export class UserStatisticsStore {
  userStatisticsRequest = new RequestStore(myStatisticsRequest);

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  load() {
    this.userStatisticsRequest.execute();
  }

  get know() {
    if (this.userStatisticsRequest.result.status !== "success") {
      return 0;
    }
    return this.userStatisticsRequest.result.data.cardsLearning.know ?? 0;
  }

  get learning() {
    if (this.userStatisticsRequest.result.status !== "success") {
      return 0;
    }
    return this.userStatisticsRequest.result.data.cardsLearning.learning ?? 0;
  }

  get total() {
    return this.know + this.learning;
  }

  get frequencyChart(): PieChartData[] {
    if (this.userStatisticsRequest.result.status !== "success") {
      return [];
    }

    return this.userStatisticsRequest.result.data.intervalFrequency;
  }

  get isFrequencyChartEmpty() {
    const isEmpty = this.frequencyChart.every((item) => item.frequency === 0);

    const isOnlyFirstAvailable =
      this.frequencyChart.length === 1 &&
      this.frequencyChart[0].interval_range === "0-5";

    return isEmpty || isOnlyFirstAvailable;
  }
}
