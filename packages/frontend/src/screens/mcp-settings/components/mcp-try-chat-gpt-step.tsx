import { translateMassCreatePaywall } from "../../shared/feature-preview/translate-mass-create-paywall.ts";
import { useMcpSettingsStore } from "../store/mcp-settings-store-context.tsx";
import { mcpT } from "../translations.ts";
import { CopyableValue } from "./copyable-value.tsx";

export function McpTryChatGptStep() {
  const store = useMcpSettingsStore();
  const { promptExample1, promptExample2 } = translateMassCreatePaywall();

  return (
    <>
      <h2 className="mt-6 text-center text-[28px] font-bold leading-tight">
        {store.title}
      </h2>
      <div className="mt-6 flex w-full flex-col gap-3">
        <CopyableValue value={mcpT("decksCountPrompt")} />
        <CopyableValue value={promptExample1} />
        <CopyableValue value={promptExample2} />
      </div>
    </>
  );
}
