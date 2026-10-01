import { ExternalLinkIcon } from "lucide-react";
import { ExternalLink } from "../../../ui/external-link.tsx";
import { LabelGroup } from "../../../ui/label-group.tsx";
import { t } from "../../../translations/t.ts";
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

  const [instructionBeforeLink, instructionAfterLink] =
    mcpT("instruction").split("{link}");

  return (
    <>
      <h2 className="mt-6 text-center text-[28px] font-bold leading-tight">
        {store.title}
      </h2>
      <div className="mt-3 text-pretty text-center text-[17px] leading-6 text-hint">
        {instructionBeforeLink}
        <ExternalLink
          className="inline whitespace-nowrap border-0 bg-transparent p-0 font-[inherit] leading-6 text-link underline decoration-dashed underline-offset-4"
          href={CHATGPT_APPS_URL}
        >
          {mcpT("appSettingsLink")}
          <ExternalLinkIcon className="ms-1 inline-block" size={15} />
        </ExternalLink>
        {instructionAfterLink}
      </div>

      <div className="mt-3 flex w-full flex-col gap-5 rounded-2xl bg-secondary-bg pt-4">
        <McpField label={mcpT("nameLabel")} value="Memo Card" />
        <McpField label={t("description")} value={mcpT("descriptionValue")} />
        <LabelGroup title={mcpT("serverUrlLabel")}>
          <CopyableValue monospace value={connectionUrl} />
        </LabelGroup>

        <LabelGroup title={mcpT("authenticationLabel")}>
          <div className="py-1 ps-3 text-sm font-medium text-text">
            {mcpT("authenticationInstruction")}
          </div>
        </LabelGroup>
      </div>
    </>
  );
}
