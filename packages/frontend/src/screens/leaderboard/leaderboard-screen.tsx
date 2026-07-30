import { type LeaderboardEntry, type LeaderboardResponse } from "api";
import { TrophyIcon } from "lucide-react";
import { type QueryState } from "../../lib/mobx-query-lite/make-query.ts";
import { cn } from "../../ui/cn.ts";
import { ListHeader } from "../../ui/list-header.tsx";
import { Skeleton } from "../../ui/skeleton.tsx";
import { formatNumber } from "../../translations/format-number.ts";
import { t } from "../../translations/t.ts";
import { Screen } from "../shared/screen.tsx";
import { leaderboardStore } from "./leaderboard-store.ts";
import {
  translateLeaderboardReviewLabel,
  translateLeaderboardReviewsToPass,
} from "./translations.ts";

function PositionCard({
  currentUser,
  participantCount,
}: {
  currentUser: LeaderboardEntry | null | undefined;
  participantCount: number | undefined;
}) {
  if (currentUser === undefined) {
    return (
      <div className="rounded-xl bg-bg px-4 py-4">
        <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-hint">
          {t("leaderboard_your_position")}
        </div>
        <div className="mt-2 flex items-end justify-between gap-4">
          <Skeleton className="h-7 w-24 rounded" />
          <div className="text-right">
            <Skeleton className="ml-auto h-6 w-12 rounded" />
            <div className="text-[11px] text-hint">
              {translateLeaderboardReviewLabel(2)}
            </div>
          </div>
        </div>

        <div className="mt-3 border-t border-secondary-bg pt-3 text-[12px]">
          <Skeleton className="h-[18px] w-4/5 rounded" />
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="rounded-xl bg-bg px-4 py-4">
        <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-hint">
          {t("leaderboard_your_position")}
        </div>
        <div className="mt-2 flex min-h-10 items-end text-[19px] font-semibold">
          {t("leaderboard_not_ranked")}
        </div>
        <div className="mt-3 border-t border-secondary-bg pt-3 text-[12px] text-hint">
          {t("leaderboard_join")}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-bg px-4 py-4">
      <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-hint">
        {t("leaderboard_your_position")}
      </div>
      <div className="mt-2 flex items-end justify-between gap-4">
        <div className="text-[25px] font-bold leading-7 tabular-nums">
          #{currentUser.rank}
          <span className="ml-1.5 text-[13px] font-medium text-hint">
            {t("leaderboard_of")} {participantCount}
          </span>
        </div>
        <div className="text-right">
          <div className="text-[22px] font-bold leading-6 tabular-nums">
            {formatNumber(currentUser.reviews)}
          </div>
          <div className="text-[11px] text-hint">
            {translateLeaderboardReviewLabel(currentUser.reviews)}
          </div>
        </div>
      </div>

      <div className="mt-3 border-t border-secondary-bg pt-3 text-[12px]">
        {currentUser.reviewsToNextRank !== null ? (
          <span className="text-hint">
            {formatNumber(currentUser.reviewsToNextRank)}{" "}
            {translateLeaderboardReviewsToPass(currentUser.reviewsToNextRank)} #
            {currentUser.rank - 1}
          </span>
        ) : (
          <span className="font-medium text-button">
            {t("leaderboard_first")}
          </span>
        )}
      </div>
    </div>
  );
}

function RankMarker({
  rank,
  isCurrentUser,
}: {
  rank: number;
  isCurrentUser: boolean;
}) {
  return (
    <div className="flex size-8 shrink-0 items-center justify-center">
      <div
        className={cn(
          "flex size-[29px] items-center justify-center rounded-full border font-extrabold tabular-nums",
          rank < 100 && "text-[13px]",
          rank >= 100 && rank < 1000 && "text-[10px]",
          rank >= 1000 && "text-[9px] tracking-[-0.04em]",
          rank === 1 &&
            "border-[#e19600] bg-[linear-gradient(145deg,#ffd76a_8%,#ffad1f_50%,#db7900_100%)] text-[#6b3600] shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_2px_5px_rgba(219,121,0,0.3)] dark:border-[#e99a0b] dark:bg-[linear-gradient(145deg,#ffc94f_4%,#e9910b_50%,#a95700_100%)] dark:text-[#4a2300] dark:shadow-[inset_0_1px_1px_rgba(255,235,178,0.55),0_2px_5px_rgba(0,0,0,0.4)]",
          rank === 2 &&
            "border-[#b5bdc5] bg-[linear-gradient(145deg,#f6f8fa_8%,#cbd2da_52%,#939da8_100%)] text-[#46505a] shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_2px_5px_rgba(78,91,105,0.22)] dark:border-[#929da8] dark:bg-[linear-gradient(145deg,#d9dfe5_6%,#aab4be_52%,#717d88_100%)] dark:text-[#2d3740] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.5),0_2px_5px_rgba(0,0,0,0.38)]",
          rank === 3 &&
            "border-[#ad6539] bg-[linear-gradient(145deg,#e8ae7b_8%,#c9753f_52%,#955027_100%)] text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.45),0_2px_5px_rgba(149,80,39,0.28)] dark:border-[#a95d34] dark:bg-[linear-gradient(145deg,#d89058_6%,#b76031_52%,#71391e_100%)] dark:text-white dark:shadow-[inset_0_1px_1px_rgba(255,224,199,0.35),0_2px_5px_rgba(0,0,0,0.38)]",
          rank > 3 &&
            isCurrentUser &&
            "border-[#287db5] bg-[linear-gradient(145deg,#78c9f4_8%,#3398d1_52%,#19689d_100%)] text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.55),0_2px_5px_rgba(25,104,157,0.3)] dark:border-[#2c7daf] dark:bg-[linear-gradient(145deg,#5eb5e5_6%,#287fae_52%,#175678_100%)] dark:text-white dark:shadow-[inset_0_1px_1px_rgba(198,235,255,0.38),0_2px_5px_rgba(0,0,0,0.38)]",
          rank > 3 &&
            !isCurrentUser &&
            "size-7 border-transparent bg-secondary-bg text-hint dark:bg-white/[0.06]",
        )}
      >
        {rank}
      </div>
    </div>
  );
}

function LeaderboardRow({ entry }: { entry?: LeaderboardEntry }) {
  return (
    <div
      className={cn(
        "flex min-h-[52px] items-center gap-3 border-b border-secondary-bg px-3 last:border-b-0",
        entry?.isCurrentUser &&
          entry.rank === 1 &&
          "bg-[#fff5d6] text-[#6b4200] dark:bg-[#4a350f] dark:text-[#ffd76a]",
        entry?.isCurrentUser &&
          entry.rank === 2 &&
          "bg-[#eef2f5] text-[#46505a] dark:bg-[#313940] dark:text-[#d9dfe5]",
        entry?.isCurrentUser &&
          entry.rank === 3 &&
          "bg-[#f8e5d6] text-[#7a3f20] dark:bg-[#442b1d] dark:text-[#e8ae7b]",
        entry?.isCurrentUser &&
          entry.rank > 3 &&
          entry.rank <= 10 &&
          "bg-[#e4f3fb] text-[#19689d] dark:bg-[#18384c] dark:text-[#78c9f4]",
      )}
    >
      {entry ? (
        <>
          <RankMarker rank={entry.rank} isCurrentUser={entry.isCurrentUser} />
          <div className="min-w-0 flex-1 truncate text-[14px] font-medium">
            {entry.displayName}
          </div>
          <div className="shrink-0 text-[14px] font-semibold tabular-nums">
            {formatNumber(entry.reviews)}
          </div>
        </>
      ) : (
        <>
          <div className="flex size-8 shrink-0 items-center justify-center">
            <Skeleton className="size-7 rounded-full" />
          </div>
          <Skeleton className="h-4 w-2/5 rounded" />
          <Skeleton className="ml-auto h-4 w-10 rounded" />
        </>
      )}
    </div>
  );
}

const loadingRows = Array.from({ length: 10 }, (_, index) => index);

function LeaderboardContent({ data }: { data?: LeaderboardResponse }) {
  const topEntries = data?.entries.filter((entry) => entry.rank <= 10);
  const currentUserOutsideTopTen =
    data?.currentUser && data.currentUser.rank > 10 ? data.currentUser : null;

  return (
    <>
      <div className="px-1 text-[12px] text-hint">
        {t("leaderboard_this_week")}
      </div>

      <PositionCard
        currentUser={data?.currentUser}
        participantCount={data?.participantCount}
      />

      <div className="mt-1">
        <ListHeader text={t("leaderboard")} />
        {!topEntries || topEntries.length > 0 ? (
          <div className="overflow-hidden rounded-xl bg-bg">
            {topEntries
              ? topEntries.map((entry) => (
                  <LeaderboardRow key={entry.rank} entry={entry} />
                ))
              : loadingRows.map((row) => <LeaderboardRow key={row} />)}
          </div>
        ) : (
          <div className="rounded-xl bg-bg px-4 py-8 text-center">
            <TrophyIcon className="mx-auto text-hint" size={28} />
            <div className="mt-2 text-[14px] text-hint">
              {t("leaderboard_empty")}
            </div>
          </div>
        )}
      </div>

      {currentUserOutsideTopTen && (
        <div className="mt-1">
          <ListHeader text={t("leaderboard_your_position")} />
          <div className="overflow-hidden rounded-xl bg-bg">
            <LeaderboardRow entry={currentUserOutsideTopTen} />
          </div>
        </div>
      )}
    </>
  );
}

export type LeaderboardViewQuery = Pick<
  QueryState<LeaderboardResponse>,
  "data" | "error" | "isPending"
>;

export function LeaderboardView({ query }: { query: LeaderboardViewQuery }) {
  if (query.data) {
    return <LeaderboardContent data={query.data} />;
  }

  if (query.isPending) {
    return <LeaderboardContent />;
  }

  return (
    <div className="rounded-xl bg-bg px-4 py-5 text-center text-[14px] text-hint">
      {t("error_contact_support")}
    </div>
  );
}

export function LeaderboardScreen() {
  const query = leaderboardStore.leaderboardQuery;

  return (
    <Screen title={t("leaderboard")}>
      <LeaderboardView query={query} />
    </Screen>
  );
}
