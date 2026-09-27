import { CheckIcon } from "lucide-react";
import { LabelGroup } from "../../../ui/label-group.tsx";
import { TextButton } from "../../../ui/text-button.tsx";
import { useMcpWizardStore } from "../store/mcp-wizard-store-context.tsx";
import { mcpT } from "../translations.ts";
import { CopyableValue } from "./copyable-value.tsx";

export function McpConfigured() {
  const store = useMcpWizardStore();
  const connectionUrl = store.connectionUrl;

  if (!connectionUrl) {
    return null;
  }

  return (
    <>
      <div className="flex size-[150px] items-center justify-center rounded-full bg-button-outline-bg-light text-link dark:bg-button-outline-bg-dark">
        <CheckIcon size={70} strokeWidth={1.8} />
      </div>
      <h2 className="mt-6 text-center text-[28px] font-bold leading-tight">
        {mcpT("configuredTitle")}
      </h2>
      <div className="mt-6 w-full rounded-2xl bg-secondary-bg p-4">
        <LabelGroup title={mcpT("serverUrlLabel")}>
          <CopyableValue monospace value={connectionUrl} />
        </LabelGroup>
      </div>
      <TextButton
        className="mt-4 underline"
        onClick={store.openGuide}
        type="button"
      >
        {mcpT("guideLink")}
      </TextButton>
    </>
  );
}
