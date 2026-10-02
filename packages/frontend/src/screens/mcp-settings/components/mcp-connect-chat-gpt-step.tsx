import { ExternalLinkIcon } from "lucide-react";
import { ButtonLink } from "../../../ui/button-link.tsx";
import { platform } from "../../../lib/platform/platform.ts";
import { LabelGroup } from "../../../ui/label-group.tsx";
import { t } from "../../../translations/t.ts";
import { useMcpWizardStore } from "../store/mcp-wizard-store-context.tsx";
import { td } from "../../../translations/td.tsx";
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
      <div className="mt-3 text-pretty text-center text-[17px] leading-6 text-hint">
        {td("instruction", {
          link: (text) => (
            <ButtonLink
              variant="dotted"
              onClick={() => platform.openExternalLink(CHATGPT_APPS_URL)}
            >
              {text}
              <ExternalLinkIcon className="ms-1 inline-block" size={15} />
            </ButtonLink>
          ),
        })}
      </div>

      <div className="mt-3 flex w-full flex-col gap-5 rounded-2xl bg-secondary-bg pt-4">
        <McpField label={t("nameLabel")} value="Memo Card" />
        <McpField label={t("description")} value={t("descriptionValue")} />
        <LabelGroup title={t("serverUrlLabel")}>
          <CopyableValue monospace value={connectionUrl} />
        </LabelGroup>

        <LabelGroup title={t("authenticationLabel")}>
          <div className="py-1 ps-3 text-sm font-medium text-text">
            {t("authenticationInstruction")}
          </div>
        </LabelGroup>
      </div>
    </>
  );
}
