import { t } from "../../translations/t.ts";
import { RepeatCustomSelectorStore } from "./repeat-custom-selector-store.ts";

type Props = {
  store: RepeatCustomSelectorStore;
};

export function SelectAllToggle({ store }: Props) {
  return (
    <button
      className="text-link text-sm uppercase flex shrink-0 items-center gap-1"
      onClick={store.toggleSelectAllDecks}
    >
      {store.areAllDecksSelected ? t("deselect_all") : t("select_all")}
    </button>
  );
}
