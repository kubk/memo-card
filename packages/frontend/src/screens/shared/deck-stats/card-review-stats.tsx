import { userStore } from "../../../store/user-store.ts";
import { t } from "../../../translations/t.ts";
import { cn } from "../../../ui/cn.ts";

type StatValueProps = {
  isLoading: boolean;
  value: number;
};

function StatValue(props: StatValueProps) {
  const { isLoading, value } = props;

  return (
    <div className="flex h-6 items-center justify-center">
      {isLoading ? (
        <span className="h-4 w-7 animate-pulse rounded bg-current opacity-20" />
      ) : (
        <span className="text-2xl font-bold leading-none">{value}</span>
      )}
    </div>
  );
}

type Props = {
  isLoading: boolean;
  newCardsCount: number;
  repeatCardsCount: number;
  totalCardsCount: number;
};

export function CardReviewStats(props: Props) {
  const { isLoading, newCardsCount, repeatCardsCount, totalCardsCount } = props;

  return (
    <div
      className={cn("flex justify-between gap-2.5 -mb-0.5", {
        "flex-reverse": userStore.isRtl,
      })}
    >
      <div className="flex-1 px-1 bg-amber-100 text-amber-800 dark:bg-yellow-900/60 dark:text-yellow-300 rounded-lg py-2 flex flex-col items-center border border-amber-50/50 dark:border-yellow-700/50">
        <StatValue isLoading={isLoading} value={repeatCardsCount} />
        <span className="text-xs mt-1 opacity-80 text-center">
          {t("cards_to_repeat")}
        </span>
      </div>

      <div className="flex-1 px-1 bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-300 rounded-lg py-2 flex flex-col items-center border border-green-50/50 dark:border-green-700/50">
        <StatValue isLoading={isLoading} value={newCardsCount} />
        <span className="text-xs mt-1 opacity-80 text-center">
          {t("cards_new")}
        </span>
      </div>

      <div className="flex-1 px-1 bg-gray-100 text-gray-800 dark:bg-gray-800/60 dark:text-gray-300 rounded-lg py-2 flex flex-col items-center border border-gray-50/50 dark:border-gray-700/50">
        <StatValue isLoading={isLoading} value={totalCardsCount} />
        <span className="text-xs mt-1 opacity-80 text-center">
          {t("cards_total")}
        </span>
      </div>
    </div>
  );
}
