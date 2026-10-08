import { useBackButton } from "../../lib/platform/use-back-button.ts";
import { useMainButton } from "../../lib/platform/use-main-button.ts";
import { screenStore } from "../../store/screen-store.ts";
import { cn } from "../../ui/cn.ts";
import { McpConfigured } from "./components/mcp-configured.tsx";
import { McpConnectChatGptStep } from "./components/mcp-connect-chat-gpt-step.tsx";
import { McpIntroStep } from "./components/mcp-intro-step.tsx";
import { McpTryChatGptStep } from "./components/mcp-try-chat-gpt-step.tsx";
import { McpWizardProgress } from "./components/mcp-wizard-progress.tsx";
import { BackBottomButton } from "../shared/back-bottom-button.tsx";
import { useMcpWizardStore } from "./store/mcp-wizard-store-context.tsx";

export function McpTokenSettingsContent() {
  const store = useMcpWizardStore();

  useBackButton(() => {
    if (store.isGuideOpen) {
      store.closeGuide();
      return;
    }

    screenStore.back();
  });
  useMainButton(
    () => store.mainButtonText,
    store.submitCurrentStep,
    () => !store.isConfigured,
  );

  return (
    <>
      {store.isConfigured && !store.isGuideOpen ? (
        <div className="mx-auto flex min-h-[calc(var(--app-viewport-height)_-_120px)] w-full max-w-[430px] flex-col items-center justify-center px-5 py-8">
          <McpConfigured />
        </div>
      ) : (
        <div className="mx-auto flex min-h-[calc(var(--app-viewport-height)_-_120px)] w-full max-w-[430px] flex-col items-center px-5 pt-8">
          {store.isGuideOpen ? null : (
            <div className="w-full">
              <McpWizardProgress />
            </div>
          )}

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
      )}
      <BackBottomButton
        isVisible={store.isConfigured}
        onClick={store.submitCurrentStep}
      />
    </>
  );
}
