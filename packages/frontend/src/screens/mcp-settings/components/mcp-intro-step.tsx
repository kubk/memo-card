import { BotIcon } from "lucide-react";
import { t } from "../../../translations/t.ts";

export function McpIntroStep() {
  return (
    <>
      <div className="flex h-[150px] w-[150px] items-center justify-center rounded-full bg-button-outline-bg-light text-link dark:bg-button-outline-bg-dark">
        <BotIcon size={70} strokeWidth={1.6} />
      </div>
      <h2 className="mt-6 text-center text-[28px] font-bold leading-tight">
        {t("introTitle")}
      </h2>
      <div className="mt-4 max-w-[360px] text-center text-[17px] leading-6 text-hint">
        {t("introDescription")}
      </div>
    </>
  );
}
