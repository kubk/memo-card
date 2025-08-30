import { cn } from "../../ui/cn.ts";
import { t } from "../../translations/t.ts";
import { RepeatCustomSelectorStore } from "./repeat-custom-selector-store.ts";

type Props = {
  store: RepeatCustomSelectorStore;
};

export function SelectAllToggle({ store }: Props) {
  return (
    <button
      className={cn(
        "absolute top-1 text-link text-sm uppercase flex items-center gap-1 end-3",
      )}
      onClick={store.toggleSelectAllDecks}
    >
      {store.areAllDecksSelected ? t("deselect_all") : t("select_all")}
    </button>
  );
}
