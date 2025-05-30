import { useLocalObservable } from "mobx-react-lite";
import { Screen } from "../shared/screen.tsx";
import { useAiMassCreationStore } from "./store/ai-mass-creation-store-provider.tsx";
import { useMount } from "../../lib/react/use-mount.ts";
import { ScreenLoader } from "../../ui/full-screen-loader.tsx";
import { useBackButton } from "../../lib/platform/use-back-button.ts";
import { Flex } from "../../ui/flex.tsx";
import { useMainButton } from "../../lib/platform/use-main-button.ts";
import { TextField } from "mobx-form-lite";
import { boolNarrow } from "../../lib/typescript/bool-narrow.ts";
import { t } from "../../translations/t.ts";
import { EmptyState } from "../../ui/empty-state.tsx";
import { cn } from "../../ui/cn.ts";

export function PreviousPromptsScreen() {
  const store = useAiMassCreationStore();
  const localStore = useLocalObservable(() => ({
    selectedIndex: new TextField<number | null>(null),
    get isMainButtonVisible() {
      return localStore.selectedIndex.value !== null;
    },
  }));

  useMount(() => {
    store.userPreviousPromptsRequest.execute();
  });

  useBackButton(() => {
    store.screen.onChange(null);
  });

  useMainButton(
    t("ai_cards_use_template"),
    () => {
      store.usePreviousPrompt(localStore.selectedIndex);
    },
    () => localStore.isMainButtonVisible,
  );

  return (
    <Screen title={t("ai_cards_previous_prompts")}>
      <Flex direction={"column"} gap={8}>
        {store.userPreviousPromptsRequest.isLoading && <ScreenLoader />}
        {store.userPreviousPromptsRequest.result.status === "success" &&
          store.userPreviousPromptsRequest.result.data.length === 0 && (
            <EmptyState>{t("ai_cards_no_previous_prompts")}</EmptyState>
          )}
        {store.userPreviousPromptsRequest.result.status === "success" && (
          <>
            {store.userPreviousPromptsRequest.result.data.map((log, i) => {
              const secondaryFields = [
                log.payload.frontPrompt,
                log.payload.backPrompt,
                log.payload.examplePrompt,
              ].filter(boolNarrow);

              const isSelected = localStore.selectedIndex.value === i;

              return (
                <div
                  className={cn(
                    "bg-bg rounded-[12px] p-3 flex justify-between items-center cursor-pointer",
                    isSelected && "outline-2 outline-button",
                  )}
                  key={i}
                  onClick={() => {
                    localStore.selectedIndex.onChange(i);
                  }}
                >
                  <Flex direction={"column"} gap={4}>
                    <div className="max-h-[120px] overflow-hidden">
                      {log.payload.prompt}
                    </div>
                    {secondaryFields.map((field, i) => {
                      return (
                        <div
                          key={i}
                          className="text-sm text-hint border-t border-divider dark:border-separator-dark pt-1"
                        >
                          {field}
                        </div>
                      );
                    })}
                  </Flex>
                </div>
              );
            })}
          </>
        )}
      </Flex>
    </Screen>
  );
}
