import { type RouterOutput } from "api";
import { LoaderCircleIcon, TrophyIcon } from "lucide-react";
import { useBackButton } from "../../lib/platform/use-back-button.ts";
import { useBottomReached } from "../../lib/react/use-bottom-reached.ts";
import { screenStore } from "../../store/screen-store.ts";
import { t, translator } from "../../translations/t.ts";
import { cn } from "../../ui/cn.ts";
import { Skeleton } from "../../ui/skeleton.tsx";
import { Screen } from "../shared/screen.tsx";
import { leaderboardStore } from "./leaderboard-store.ts";

function Podium({
  result,
}: {
  result?: RouterOutput["leaderboardStatistics"]["items"][number];
}) {
  const date =
    result &&
    new Intl.DateTimeFormat(translator.getLang(), {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    })
      .format(result.date)
      .replace(/\.$/, "");

  return (
    <section>
      <h2 className="mb-2 px-1 text-[15px] font-medium leading-6 text-hint">
        {result ? (
          <time dateTime={new Date(result.date).toISOString()}>{date}</time>
        ) : (
          <span className="flex h-6 items-center">
            <Skeleton className="h-4 w-36 rounded" />
          </span>
        )}
      </h2>
      <div
        dir="ltr"
        className="flex items-end gap-2 rounded-xl bg-bg px-5 pb-6 pt-5"
      >
        {[2, 1, 3].map((rank) => {
          const entry = result?.entries.find((item) => item.rank === rank);
          return (
            <div
              key={rank}
              className="flex min-w-0 flex-1 flex-col items-center"
            >
              {(!result || entry) && (
                <>
                  <div
                    dir="auto"
                    title={entry?.displayName}
                    className="mb-2 w-full truncate text-center text-sm font-semibold leading-5"
                  >
                    {entry ? (
                      entry.displayName
                    ) : (
                      <span className="flex h-5 items-center justify-center">
                        <Skeleton className="h-3.5 w-3/4 max-w-24 rounded" />
                      </span>
                    )}
                  </div>
                  <div
                    className={cn(
                      "mb-2 flex size-9 items-center justify-center rounded-full text-xl font-bold shadow-inner",
                      rank === 1 &&
                        "size-[42px] bg-[linear-gradient(135deg,#ffd457,#ee9e06)] text-[#744700]",
                      rank === 2 &&
                        "bg-[linear-gradient(135deg,#e1e7ec,#8b99a6)] text-[#35414c]",
                      rank === 3 &&
                        "bg-[linear-gradient(135deg,#dc935e,#914619)] text-white",
                    )}
                  >
                    {rank}
                  </div>
                  <div
                    className={cn(
                      "w-full rounded-t-md bg-secondary-bg dark:bg-[#263746]",
                      rank === 1 && "h-[39px]",
                      rank === 2 && "h-[26px]",
                      rank === 3 && "h-[17px]",
                    )}
                  />
                </>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function LeaderboardStatisticsScreen() {
  const query = leaderboardStore.statisticsQuery;
  const data = query.data;
  useBackButton(() => screenStore.back());
  useBottomReached(query.fetchNextPage, {
    enabled: query.hasNextPage && !query.isFetching && !query.error,
  });

  return (
    <Screen title={t("leaderboard_statistics")}>
      <div className="flex flex-col gap-5">
        {query.isPending
          ? [0, 1, 2].map((index) => <Podium key={index} />)
          : data?.items.map((result) => (
              <Podium key={result.date} result={result} />
            ))}
        {data?.items.length === 0 && (
          <div className="rounded-xl bg-bg px-4 py-8 text-center text-sm text-hint">
            <TrophyIcon size={28} className="mx-auto mb-2" />
            {t("leaderboard_statistics_empty")}
          </div>
        )}
        {query.error && (
          <div className="rounded-xl bg-bg px-4 py-5 text-center text-sm text-hint">
            {t("error_contact_support")}
          </div>
        )}
        {query.isFetchingNextPage && (
          <div className="flex justify-center py-3">
            <LoaderCircleIcon size={24} className="animate-spin text-hint" />
          </div>
        )}
      </div>
    </Screen>
  );
}
