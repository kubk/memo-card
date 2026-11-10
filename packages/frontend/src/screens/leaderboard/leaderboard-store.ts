import { makeInfiniteQuery, makeQuery } from "mobx-query-lite";
import { makeAutoObservable } from "mobx";
import { api, apiProxy } from "../../api/trpc-api.ts";

class LeaderboardStore {
  statisticsQuery = makeInfiniteQuery({
    key: "leaderboardStatistics",
    query: ({ cursor }) => api.leaderboardStatistics.query({ cursor }),
  });

  leaderboardQuery = makeQuery(apiProxy.leaderboard.query, {
    staleTime: 60 * 1000,
  });

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }
}

export const leaderboardStore = new LeaderboardStore();
