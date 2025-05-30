import { t } from "../../translations/t.ts";

export function EmptyStudyFrequencyChartText() {
  return (
    <div
      style={{ transform: "translate(-50%, -50%)" }}
      className="bg-bg text-text p-3 shadow rounded-[12px] absolute top-1/2 left-1/2 text-sm w-[250px] text-center"
    >
      {t("user_stats_empty_text")}
    </div>
  );
}
