import { CheckCircleIcon } from "lucide-react";
import { t } from "../../translations/t.ts";

export function DeckAddedLabel() {
  return (
    <div
      title={t("deck_has_been_added")}
      className="absolute right-0 top-0 rounded-[12px] bg-bg"
    >
      <CheckCircleIcon size={18} className="text-link" />
    </div>
  );
}
