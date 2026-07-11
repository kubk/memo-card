import { type LanguageShared, type RouterOutput } from "api";
import { LibraryBigIcon, LoaderCircleIcon, UsersIcon } from "lucide-react";
import { type ReactNode, useState } from "react";
import { api } from "../../api/trpc-api.ts";
import { platform } from "../../lib/platform/platform.ts";
import { useBackButton } from "../../lib/platform/use-back-button.ts";
import { useBottomReached } from "../../lib/react/use-bottom-reached.ts";
import { useMount } from "../../lib/react/use-mount.ts";
import { InfiniteRequestStore } from "../../lib/mobx-request/infinite-request-store.ts";
import { makeQuery } from "../../lib/mobx-query-lite/make-query.ts";
import { screenStore } from "../../store/screen-store.ts";
import { cn } from "../../ui/cn.ts";
import { ChevronIcon } from "../../ui/chevron-icon.tsx";
import { FilledIcon } from "../../ui/filled-icon.tsx";
import { ListHeader } from "../../ui/list-header.tsx";
import { theme } from "../../ui/theme.tsx";
import { t, translator } from "../../translations/t.ts";
import { CardRowLoading } from "../shared/card-row-loading.tsx";
import { Screen } from "../shared/screen.tsx";
import { formatNumber } from "../../translations/format-number.ts";

type TeacherStatistics = RouterOutput["teacherStatistics"];
type TeacherStudent = TeacherStatistics["topStudents"][number];
type TeacherDeck = TeacherStatistics["topDecks"][number];
type StudentPage = RouterOutput["teacherStatisticsStudents"];
type DeckPage = RouterOutput["teacherStatisticsDecks"];
type StudentCursor = NonNullable<StudentPage["nextCursor"]>;
type DeckCursor = NonNullable<DeckPage["nextCursor"]>;

const teacherStatisticsQuery = makeQuery({
  key: "teacherStatistics",
  query: api.teacherStatistics.query,
});

function formatDaysAgo(days: number, lang: LanguageShared) {
  const daysText = formatNumber(days);

  switch (lang) {
    case "en":
      return `${daysText} days ago`;
    case "ru":
      return `${daysText} дн. назад`;
    case "es":
      return `hace ${daysText} días`;
    case "pt-br":
      return `há ${daysText} dias`;
    case "uk":
      return `${daysText} дн. тому`;
    case "fa":
      return `${daysText} روز پیش`;
    case "ar":
      return `قبل ${daysText} أيام`;
    default:
      return lang satisfies never;
  }
}

function formatDateDistance(value: string | null) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  const today = new Date();
  const diffMs = today.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));

  if (diffDays <= 0) {
    return t("teacher_stats_today");
  }

  if (diffDays === 1) {
    return t("teacher_stats_yesterday");
  }

  if (diffDays < 7) {
    return formatDaysAgo(diffDays, translator.getLang());
  }

  return new Intl.DateTimeFormat(translator.getLang(), {
    month: "short",
    day: "numeric",
  }).format(date);
}

function SummaryTile(props: {
  label: string;
  value: string | number;
  icon: ReactNode;
  iconColor: string;
}) {
  return (
    <div className="min-w-0 rounded-xl bg-bg p-4">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="text-[12px] font-medium uppercase leading-4 text-hint">
          {props.label}
        </div>
        <FilledIcon backgroundColor={props.iconColor} icon={props.icon} />
      </div>
      <div className="truncate text-[32px] font-semibold leading-9 tabular-nums text-text">
        {props.value}
      </div>
    </div>
  );
}

function SectionTitle(props: { title: string; onSeeAll?: () => void }) {
  return (
    <ListHeader
      text={props.title}
      rightSlot={
        props.onSeeAll ? (
          <button
            type="button"
            className="absolute top-1 end-1 flex shrink-0 items-center gap-1 text-sm uppercase text-link"
            onClick={props.onSeeAll}
          >
            {t("teacher_stats_see_all")}
            <ChevronIcon direction="right" />
          </button>
        ) : undefined
      }
    />
  );
}

function EmptyBlock(props: { children: ReactNode }) {
  return (
    <div className="rounded-xl bg-bg px-4 py-5 text-center text-[14px] leading-5 text-hint">
      {props.children}
    </div>
  );
}

function ShortStat(props: {
  label: string;
  value: string | number;
  tone?: "default" | "warning";
}) {
  return (
    <div className="min-w-0">
      <div
        className={cn(
          "truncate text-[13px] font-semibold leading-4 tabular-nums text-text",
          props.tone === "warning" && "text-orange",
        )}
      >
        {props.value}
      </div>
      <div className="truncate text-[11px] uppercase leading-3 text-hint">
        {props.label}
      </div>
    </div>
  );
}

function StudentRow(props: { student: TeacherStudent }) {
  const { student } = props;
  const telegramUrl = student.username
    ? `http://t.me/${student.username}`
    : null;

  return (
    <div className="rounded-xl bg-bg p-3">
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex min-w-0 items-baseline gap-1.5">
            <div className="min-w-0 truncate text-[15px] font-semibold leading-5 text-text">
              {student.studentName}
            </div>
            {telegramUrl ? (
              <>
                <span className="shrink-0 text-[12px] leading-4 text-hint">
                  ·
                </span>
                <button
                  type="button"
                  className="min-w-0 truncate text-[12px] font-medium leading-4 text-link"
                  onClick={() => {
                    platform.openInternalLink(telegramUrl);
                  }}
                >
                  @{student.username}
                </button>
              </>
            ) : null}
          </div>
          <div className="truncate text-[12px] leading-4 text-hint">
            {t("teacher_stats_last_repeat")}:{" "}
            {formatDateDistance(student.lastReviewedAt)}
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-4 gap-2 text-[12px] leading-4">
        <ShortStat label={t("teacher_stats_decks")} value={student.deckCount} />
        <ShortStat
          label={t("teacher_stats_seen")}
          value={`${formatNumber(student.cardsSeen)}/${formatNumber(
            student.totalCards,
          )}`}
        />
        <ShortStat
          label={t("teacher_stats_due")}
          value={formatNumber(student.dueNow)}
          tone={student.dueNow > 0 ? "warning" : "default"}
        />
        <ShortStat
          label={t("teacher_stats_repeats")}
          value={formatNumber(student.reviews)}
        />
      </div>
    </div>
  );
}

function DeckRow(props: { deck: TeacherDeck }) {
  const { deck } = props;

  return (
    <div className="rounded-xl bg-bg p-3">
      <div className="min-w-0">
        <div className="truncate text-[15px] font-semibold leading-5 text-text">
          {deck.deckName}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-[12px] leading-4">
        <ShortStat
          label={t("teacher_stats_users")}
          value={formatNumber(deck.studentCount)}
        />
        <ShortStat
          label={t("teacher_stats_repeats")}
          value={formatNumber(deck.reviews)}
        />
      </div>
    </div>
  );
}

function TeacherStatisticsLoading() {
  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <CardRowLoading speed={1} />
        <CardRowLoading speed={1} />
      </div>
      <CardRowLoading speed={1} />
      <CardRowLoading speed={1} />
      <CardRowLoading speed={1} />
    </>
  );
}

function TeacherStatisticsContent(props: { statistics: TeacherStatistics }) {
  const { statistics } = props;
  const { overview } = statistics;
  const hasTeacherDecks = overview.deckCount > 0;

  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <SummaryTile
          label={t("teacher_stats_students")}
          value={formatNumber(overview.studentCount)}
          icon={<UsersIcon size={17} />}
          iconColor={theme.icons.blue}
        />
        <SummaryTile
          label={t("teacher_stats_decks_shared")}
          value={formatNumber(overview.sharedDeckCount)}
          icon={<LibraryBigIcon size={17} />}
          iconColor={theme.icons.turquoise}
        />
      </div>

      {!hasTeacherDecks ? (
        <EmptyBlock>{t("teacher_stats_no_decks")}</EmptyBlock>
      ) : (
        <>
          <section>
            <SectionTitle
              title={t("teacher_stats_top_students")}
              onSeeAll={
                overview.studentCount > 0
                  ? () =>
                      screenStore.push({
                        type: "teacherStatisticsList",
                        listType: "students",
                      })
                  : undefined
              }
            />
            {statistics.topStudents.length > 0 ? (
              <div className="flex flex-col gap-2">
                {statistics.topStudents.map((student) => (
                  <StudentRow key={student.studentId} student={student} />
                ))}
              </div>
            ) : (
              <EmptyBlock>{t("teacher_stats_no_student_activity")}</EmptyBlock>
            )}
          </section>

          <section>
            <SectionTitle
              title={t("teacher_stats_top_decks")}
              onSeeAll={
                overview.sharedDeckCount > 0
                  ? () =>
                      screenStore.push({
                        type: "teacherStatisticsList",
                        listType: "decks",
                      })
                  : undefined
              }
            />
            {statistics.topDecks.length > 0 ? (
              <div className="flex flex-col gap-2">
                {statistics.topDecks.map((deck) => (
                  <DeckRow key={deck.deckId} deck={deck} />
                ))}
              </div>
            ) : (
              <EmptyBlock>{t("teacher_stats_no_deck_activity")}</EmptyBlock>
            )}
          </section>
        </>
      )}
    </>
  );
}

function StudentListScreen() {
  const [studentsRequest] = useState(
    () =>
      new InfiniteRequestStore<TeacherStudent, StudentCursor>(
        api.teacherStatisticsStudents.query,
        {
          pageSize: 20,
          getItemKey: (student) => String(student.studentId),
        },
      ),
  );

  useMount(() => {
    studentsRequest.reload();
  });

  useBottomReached(
    () => {
      studentsRequest.loadMore();
    },
    {
      enabled: studentsRequest.hasLoaded && !studentsRequest.isInitialLoading,
    },
  );

  useBackButton(() => {
    screenStore.back();
  });

  return (
    <Screen title={t("teacher_stats_all_students")}>
      {studentsRequest.isInitialLoading ? (
        <ListLoading />
      ) : studentsRequest.loadError && studentsRequest.items.length === 0 ? (
        <EmptyBlock>{t("teacher_stats_students_load_error")}</EmptyBlock>
      ) : studentsRequest.items.length > 0 ? (
        <>
          <div className="flex flex-col gap-2">
            {studentsRequest.items.map((student) => (
              <StudentRow key={student.studentId} student={student} />
            ))}
          </div>
          <ListBottomLoader isLoading={studentsRequest.isLoadingMore} />
        </>
      ) : (
        <EmptyBlock>{t("teacher_stats_no_students")}</EmptyBlock>
      )}
    </Screen>
  );
}

function DeckListScreen() {
  const [decksRequest] = useState(
    () =>
      new InfiniteRequestStore<TeacherDeck, DeckCursor>(
        api.teacherStatisticsDecks.query,
        {
          pageSize: 20,
          getItemKey: (deck) => String(deck.deckId),
        },
      ),
  );

  useMount(() => {
    decksRequest.reload();
  });

  useBottomReached(
    () => {
      decksRequest.loadMore();
    },
    {
      enabled: decksRequest.hasLoaded && !decksRequest.isInitialLoading,
    },
  );

  useBackButton(() => {
    screenStore.back();
  });

  return (
    <Screen title={t("teacher_stats_all_decks")}>
      {decksRequest.isInitialLoading ? (
        <ListLoading />
      ) : decksRequest.loadError && decksRequest.items.length === 0 ? (
        <EmptyBlock>{t("teacher_stats_decks_load_error")}</EmptyBlock>
      ) : decksRequest.items.length > 0 ? (
        <>
          <div className="flex flex-col gap-2">
            {decksRequest.items.map((deck) => (
              <DeckRow key={deck.deckId} deck={deck} />
            ))}
          </div>
          <ListBottomLoader isLoading={decksRequest.isLoadingMore} />
        </>
      ) : (
        <EmptyBlock>{t("teacher_stats_no_shared_decks")}</EmptyBlock>
      )}
    </Screen>
  );
}

function ListLoading() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, index) => (
        <CardRowLoading key={index} speed={1} />
      ))}
    </>
  );
}

function ListBottomLoader(props: { isLoading: boolean }) {
  if (!props.isLoading) {
    return null;
  }

  return (
    <div className="flex justify-center py-3">
      <LoaderCircleIcon size={24} className="animate-spin text-hint" />
    </div>
  );
}

export function TeacherStatisticsScreen() {
  useBackButton(() => {
    screenStore.back();
  });

  const statistics = teacherStatisticsQuery.data;

  return (
    <Screen title="MemoCard Teacher">
      {teacherStatisticsQuery.isPending ? (
        <TeacherStatisticsLoading />
      ) : teacherStatisticsQuery.error || !statistics ? (
        <EmptyBlock>{t("teacher_stats_load_error")}</EmptyBlock>
      ) : (
        <TeacherStatisticsContent statistics={statistics} />
      )}
    </Screen>
  );
}

export function TeacherStatisticsListScreen() {
  const screen = screenStore.screen;
  const listType =
    screen.type === "teacherStatisticsList" ? screen.listType : "students";

  return listType === "students" ? <StudentListScreen /> : <DeckListScreen />;
}
