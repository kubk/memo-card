import { t } from "../../translations/t.ts";

export function NoDecksMatchingFilters() {
  return (
    <div className="mt-[150px] self-center text-center">
      <div className="font-medium">{t("deck_search_not_found")}</div>
      <div className="text-sm text-hint">
        {t("deck_search_not_found_description")}
      </div>
    </div>
  );
}
