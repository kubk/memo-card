import { BotIcon } from "lucide-react";
import { mcpT } from "../translations.ts";

export function McpIntroStep() {
  return (
    <>
      <div className="flex h-[150px] w-[150px] items-center justify-center rounded-full bg-button-outline-bg-light text-link dark:bg-button-outline-bg-dark">
        <BotIcon size={70} strokeWidth={1.6} />
      </div>
      <h2 className="mt-6 text-center text-[28px] font-bold leading-tight">
        {mcpT("introTitle")}
      </h2>
      <div className="mt-4 max-w-[360px] text-center text-[17px] leading-6 text-hint">
        {mcpT("introDescription")}
      </div>
    </>
  );
}
