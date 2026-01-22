import { t } from "../../../translations/t.ts";

// Base color styles for review outcomes
const baseOutcomeColors = {
  again:
    "bg-rose-50 text-rose-700 border-rose-50/50 dark:bg-rose-900/60 dark:text-rose-300 dark:border-rose-700/50",
  hard: "bg-amber-100 text-amber-800 dark:bg-yellow-900/60 dark:text-yellow-300 border-amber-100/50 dark:border-yellow-700/50",
  good: "bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-300 border-green-100/50 dark:border-green-700/50",
  easy: "bg-sky-100 text-sky-800 dark:bg-sky-900/60 dark:text-sky-300 border-sky-100/50 dark:border-sky-700/50",
  never:
    "bg-gray-100 text-gray-800 dark:bg-gray-900/60 dark:text-gray-300 border-gray-100/50 dark:border-gray-700/50",
  skip: "bg-slate-200 text-slate-700 dark:bg-slate-800/60 dark:text-slate-300 border-slate-200/50 dark:border-slate-600/50",
};

// Styles for small badges (used in reviewed cards list)
export const reviewOutcomeStyles = {
  again: baseOutcomeColors.again,
  hard: baseOutcomeColors.hard,
  good: baseOutcomeColors.good,
  easy: baseOutcomeColors.easy,
  never: baseOutcomeColors.never,
  skip: baseOutcomeColors.skip,
};

// Styles for review buttons (used in card review controls)
export const reviewOutcomeButtonStyles = {
  again:
    "cursor-pointer py-2 flex-auto bg-rose-50 text-rose-700 border border-rose-50/50 dark:bg-rose-900/60 dark:text-rose-300 dark:border-rose-700/50 rounded-xl active:scale-95 relative",
  hard: "cursor-pointer py-2 flex-auto bg-amber-100 text-amber-800 dark:bg-yellow-900/60 dark:text-yellow-300 border border-amber-100/50 dark:border-yellow-700/50 rounded-xl active:scale-95 relative",
  good: "cursor-pointer py-2 flex-auto bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-300 border border-green-100/50 dark:border-green-700/50 rounded-xl active:scale-95 relative",
  easy: "cursor-pointer py-2 flex-auto bg-sky-100 text-sky-800 dark:bg-sky-900/60 dark:text-sky-300 border border-sky-100/50 dark:border-sky-700/50 rounded-xl active:scale-95 relative",
  never:
    "cursor-pointer py-2 flex-auto bg-gray-100 text-gray-800 dark:bg-gray-900/60 dark:text-gray-300 border border-gray-100/50 dark:border-gray-700/50 rounded-xl active:scale-95 relative",
  skip: "cursor-pointer py-2 flex-auto bg-slate-200 text-slate-700 dark:bg-slate-800/60 dark:text-slate-300 border border-slate-200/50 dark:border-slate-600/50 rounded-xl active:scale-95 relative",
};

// Styles for hotkey badges (used in review controls)
export const reviewOutcomeHotkeyStyles = {
  again:
    "bg-rose-50 text-rose-700 border-rose-200 border-2 dark:bg-rose-900/60 dark:text-rose-300 dark:border-rose-700",
  hard: "bg-amber-100 text-amber-800 border-amber-200 border-2 dark:bg-yellow-900/60 dark:text-yellow-300 dark:border-yellow-700",
  good: "bg-green-100 text-green-800 border-green-200 border-2 dark:bg-green-900/60 dark:text-green-300 dark:border-green-700",
  easy: "bg-sky-100 text-sky-800 border-sky-200 border-2 dark:bg-sky-900/60 dark:text-sky-300 dark:border-sky-700",
  never:
    "bg-gray-100 text-gray-800 border-gray-200 border-2 dark:bg-gray-900/60 dark:text-gray-300 dark:border-gray-700",
  skip: "bg-slate-200 text-slate-700 border-slate-300 border-2 dark:bg-slate-800/60 dark:text-slate-300 dark:border-slate-600",
};

export const reviewOutcomeLabels = {
  again: () => t("review_again"),
  hard: () => t("review_hard"),
  good: () => t("review_good"),
  easy: () => t("review_easy"),
  never: () => t("hide_card_forever"),
  skip: () => t("review_skipped"),
};
