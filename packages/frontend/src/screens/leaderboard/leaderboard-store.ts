import { makeAutoObservable } from "mobx";
import { apiProxy } from "../../api/trpc-api.ts";
import { makeQuery } from "../../lib/mobx-query-lite/make-query.ts";

class LeaderboardStore {
  leaderboardQuery = makeQuery(apiProxy.leaderboard.query, {
    staleTime: 60 * 1000,
  });

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }
}

export const leaderboardStore = new LeaderboardStore();
