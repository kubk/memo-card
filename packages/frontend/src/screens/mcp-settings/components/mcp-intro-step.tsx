import { BotIcon } from "lucide-react";
import { t } from "../../../translations/t.ts";

export function McpIntroStep() {
  return (
    <>
      <div className="flex h-37.5 w-37.5 items-center justify-center rounded-full bg-button-outline-bg-light text-link dark:bg-button-outline-bg-dark">
        <BotIcon className="size-17.5" strokeWidth={1.6} />
      </div>
      <h2 className="mt-6 text-center text-[1.75rem] font-bold leading-tight">
        {t("introTitle")}
      </h2>
      <div className="mt-4 max-w-90 text-center text-[1.0625rem] leading-6 text-hint">
        {t("introDescription")}
      </div>
    </>
  );
}
