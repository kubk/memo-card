import { useMcpWizardStore } from "../store/mcp-wizard-store-context.tsx";
import { mcpT } from "../translations.ts";
import { CopyableValue } from "./copyable-value.tsx";

export function McpTryChatGptStep() {
  const store = useMcpWizardStore();

  return (
    <>
      <h2 className="mt-6 text-center text-[28px] font-bold leading-tight">
        {store.title}
      </h2>
      <div className="mt-6 flex w-full flex-col gap-3">
        <CopyableValue value={mcpT("decksCountPrompt")} />
        <CopyableValue value={mcpT("createCardsPrompt")} />
        <CopyableValue value={mcpT("createLanguageCardsPrompt")} />
      </div>
    </>
  );
}
