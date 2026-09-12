import { ExternalLinkIcon } from "lucide-react";
import { ExternalLink } from "../../../ui/external-link.tsx";
import { useMcpWizardStore } from "../store/mcp-wizard-store-context.tsx";
import { mcpT } from "../translations.ts";
import { CopyableValue } from "./copyable-value.tsx";
import { McpField } from "./mcp-field.tsx";

const CHATGPT_APPS_URL = "https://chatgpt.com/plugins";

export function McpConnectChatGptStep() {
  const store = useMcpWizardStore();
  const connectionUrl = store.connectionUrl;

  if (!connectionUrl) {
    return null;
  }

  return (
    <>
      <h2 className="mt-6 text-center text-[28px] font-bold leading-tight">
        {store.title}
      </h2>
      <div className="mt-3 text-center text-[17px] leading-6 text-hint">
        {mcpT("instructionPrefix")}
        <ExternalLink
          className="inline border-0 bg-transparent p-0 font-[inherit] leading-6 text-link underline decoration-dashed underline-offset-4"
          href={CHATGPT_APPS_URL}
        >
          {mcpT("appSettingsLink")}
          <ExternalLinkIcon className="ms-1 inline-block" size={15} />
        </ExternalLink>
        {mcpT("instructionSuffix")}
      </div>

      <div className="mt-3 w-full rounded-2xl bg-secondary-bg p-4">
        <McpField label={mcpT("nameLabel")} value={mcpT("nameValue")} />
        <McpField
          className="mt-4"
          label={mcpT("descriptionLabel")}
          value={mcpT("descriptionValue")}
        />
        <div className="mt-4 text-xs font-medium text-hint">
          {mcpT("serverUrlLabel")}
        </div>
        <CopyableValue className="mt-1.5" monospace value={connectionUrl} />

        <div className="mt-4">
          <div className="text-xs font-medium text-hint">
            {mcpT("authenticationLabel")}
          </div>
          <div className="mt-1.5 py-2 text-sm font-medium text-text">
            {mcpT("authenticationInstruction")}
          </div>
        </div>
      </div>
    </>
  );
}
