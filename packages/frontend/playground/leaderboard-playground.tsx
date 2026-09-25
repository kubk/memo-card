import { useState } from "react";
import { type LeaderboardEntry, type LeaderboardResponse } from "api";
import {
  LeaderboardView,
  type LeaderboardViewQuery,
} from "../src/screens/leaderboard/leaderboard-screen.tsx";
import {
  ShadcnSelect,
  ShadcnSelectContent,
  ShadcnSelectGroup,
  ShadcnSelectItem,
  ShadcnSelectTrigger,
  ShadcnSelectValue,
} from "../src/ui/shadcn/select.tsx";
import { Tabs, TabsList, TabsTrigger } from "../src/ui/shadcn/tabs.tsx";
import { ShadcnLabel } from "../src/ui/shadcn/label.tsx";
import { PropGroup } from "./ui/prop-controls.tsx";
import { PropsPanel } from "./ui/props-panel.tsx";

const topEntryData: Array<
  [
    displayName: string,
    reviews: number,
    uniqueCards: number,
    activeDays: number,
    reviewsToNextRank: number | null,
  ]
> = [
  ["Alex Kim", 578, 279, 4, null],
  ["Maya", 324, 93, 3, 255],
  ["@learner_c", 244, 181, 4, 81],
  ["Sam Lee", 126, 49, 1, 119],
  ["@learner_e", 125, 50, 2, 2],
  ["Noah", 114, 109, 2, 12],
  ["@learner_g", 96, 94, 3, 19],
  ["Iris", 83, 82, 2, 14],
  ["725104829", 58, 44, 2, 26],
  ["@learner_j", 20, 20, 1, 39],
];

const topEntries: LeaderboardEntry[] = topEntryData.map(
  (
    [displayName, reviews, uniqueCards, activeDays, reviewsToNextRank],
    index,
  ) => ({
    rank: index + 1,
    displayName,
    reviews,
    uniqueCards,
    activeDays,
    reviewsToNextRank,
    isCurrentUser: false,
  }),
);

const currentUserPositions = [
  1, 2, 3, 8, 10, 11, 20, 50, 100, 200, 500, 1000,
] as const;
const totalUserCounts = [10, 11, 20, 50, 100, 200, 500, 1000] as const;

const leaderboardStates = ["loaded", "loading", "empty"] as const;
type LeaderboardState = (typeof leaderboardStates)[number];

const emptyLeaderboard: LeaderboardResponse = {
  participantCount: 0,
  currentUser: null,
  entries: [],
};

export function LeaderboardPlayground() {
  const [state, setState] = useState<LeaderboardState>("loaded");
  const [currentUserPosition, setCurrentUserPosition] = useState(11);
  const [totalUserCount, setTotalUserCount] = useState(11);

  const entries = topEntries.map((entry) => ({
    ...entry,
    isCurrentUser: entry.rank === currentUserPosition,
  }));
  const currentUser =
    entries.find((entry) => entry.isCurrentUser) ??
    ({
      rank: currentUserPosition,
      displayName: "Current learner",
      reviews: Math.max(1, 20 - (currentUserPosition - 10)),
      uniqueCards: 12,
      activeDays: 2,
      reviewsToNextRank: 4,
      isCurrentUser: true,
    } satisfies LeaderboardEntry);
  const leaderboard: LeaderboardResponse = {
    participantCount: totalUserCount,
    currentUser,
    entries,
  };
  const data =
    state === "loaded"
      ? leaderboard
      : state === "empty"
        ? emptyLeaderboard
        : undefined;
  const query: LeaderboardViewQuery = {
    data,
    error: null,
    isPending: data === undefined,
  };

  return (
    <>
      <div className="h-full w-full overflow-y-auto bg-secondary-bg text-text">
        <LeaderboardView
          query={query}
          avatarPeerId={123456789}
          avatarFallbackName="Current learner"
        />
      </div>

      <PropsPanel>
        <PropGroup label="State">
          <Tabs
            value={state}
            onValueChange={(value) => {
              const nextState = leaderboardStates.find(
                (stateOption) => stateOption === value,
              );
              if (nextState) {
                setState(nextState);
              }
            }}
          >
            <TabsList className="w-full">
              {leaderboardStates.map((stateOption) => (
                <TabsTrigger
                  className="flex-1"
                  key={stateOption}
                  value={stateOption}
                >
                  {stateOption[0]!.toUpperCase() + stateOption.slice(1)}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <div className="flex flex-col gap-2">
            <ShadcnLabel>Current user #</ShadcnLabel>
            <ShadcnSelect
              disabled={state !== "loaded"}
              value={String(currentUserPosition)}
              onValueChange={(value) => {
                const position = Number(value);
                if (
                  Number.isInteger(position) &&
                  currentUserPositions.some(
                    (currentUserPosition) => currentUserPosition === position,
                  )
                ) {
                  setCurrentUserPosition(position);
                }
              }}
            >
              <ShadcnSelectTrigger className="w-full">
                <ShadcnSelectValue />
              </ShadcnSelectTrigger>
              <ShadcnSelectContent>
                <ShadcnSelectGroup>
                  {currentUserPositions.map((position) => (
                    <ShadcnSelectItem
                      key={position}
                      value={String(position)}
                      disabled={position > totalUserCount}
                    >
                      #{position}
                    </ShadcnSelectItem>
                  ))}
                </ShadcnSelectGroup>
              </ShadcnSelectContent>
            </ShadcnSelect>
          </div>
          <div className="flex flex-col gap-2">
            <ShadcnLabel>Total users</ShadcnLabel>
            <ShadcnSelect
              disabled={state !== "loaded"}
              value={String(totalUserCount)}
              onValueChange={(value) => {
                const nextTotalUserCount = Number(value);
                if (
                  totalUserCounts.some((count) => count === nextTotalUserCount)
                ) {
                  setTotalUserCount(nextTotalUserCount);
                  setCurrentUserPosition((position) =>
                    position <= nextTotalUserCount
                      ? position
                      : Math.max(
                          ...currentUserPositions.filter(
                            (availablePosition) =>
                              availablePosition <= nextTotalUserCount,
                          ),
                        ),
                  );
                }
              }}
            >
              <ShadcnSelectTrigger className="w-full">
                <ShadcnSelectValue />
              </ShadcnSelectTrigger>
              <ShadcnSelectContent>
                <ShadcnSelectGroup>
                  {totalUserCounts.map((count) => (
                    <ShadcnSelectItem key={count} value={String(count)}>
                      {count}
                    </ShadcnSelectItem>
                  ))}
                </ShadcnSelectGroup>
              </ShadcnSelectContent>
            </ShadcnSelect>
          </div>
        </PropGroup>
      </PropsPanel>
    </>
  );
}
