import { useBackButton } from "../../lib/platform/use-back-button.ts";
import { useMainButton } from "../../lib/platform/use-main-button.ts";
import { cn } from "../../ui/cn.ts";
import { McpConfigured } from "./components/mcp-configured.tsx";
import { McpConnectChatGptStep } from "./components/mcp-connect-chat-gpt-step.tsx";
import { McpIntroStep } from "./components/mcp-intro-step.tsx";
import { McpTryChatGptStep } from "./components/mcp-try-chat-gpt-step.tsx";
import { McpWizardProgress } from "./components/mcp-wizard-progress.tsx";
import { useMcpSettingsStore } from "./store/mcp-settings-store-context.tsx";

export function McpTokenSettingsContent() {
  const store = useMcpSettingsStore();

  useBackButton(store.goBack);
  useMainButton(() => store.mainButtonText, store.submitCurrentStep);

  if (store.isConfigured) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh_-_120px)] w-full max-w-[430px] flex-col items-center justify-center px-5 py-8">
        <McpConfigured />
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh_-_120px)] w-full max-w-[430px] flex-col items-center px-5 pt-8">
      <div className="w-full">
        <McpWizardProgress />
      </div>

      <div
        className={cn(
          "flex w-full flex-1 flex-col items-center",
          store.step === 2 ? "pt-10" : "justify-center",
        )}
      >
        {store.step === 1 && <McpIntroStep />}
        {store.step === 2 && <McpConnectChatGptStep />}
        {store.step === 3 && <McpTryChatGptStep />}
      </div>
    </div>
  );
}
