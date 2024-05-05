import { observer, useLocalStore } from "mobx-react-lite";
import { Screen } from "../shared/screen.tsx";
import { useAiMassCreationStore } from "./store/ai-mass-creation-store-provider.tsx";
import { useMount } from "../../lib/react/use-mount.ts";
import React from "react";
import { ScreenLoader } from "../../ui/full-screen-loader.tsx";
import { useBackButton } from "../../lib/telegram/use-back-button.tsx";
import { Flex } from "../../ui/flex.tsx";
import { css, cx } from "@emotion/css";
import { theme } from "../../ui/theme.tsx";
import { useMainButton } from "../../lib/telegram/use-main-button.tsx";
import { TextField } from "mobx-form-lite";
import { boolNarrow } from "../../lib/typescript/bool-narrow.ts";
import { t } from "../../translations/t.ts";
import { EmptyState } from "../../ui/empty-state.tsx";

export const PreviousPromptsScreen = observer(() => {
  const store = useAiMassCreationStore();
  const localStore = useLocalStore(() => ({
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
      <Flex direction={"column"} gap={4}>
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
                  className={cx(
                    css({
                      backgroundColor: theme.bgColor,
                      borderRadius: theme.borderRadius,
                      padding: 12,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                    }),
                    isSelected &&
                      css({
                        border: `2px solid ${theme.buttonColor}`,
                      }),
                  )}
                  key={i}
                  onClick={() => {
                    localStore.selectedIndex.onChange(i);
                  }}
                >
                  <Flex direction={"column"} gap={4}>
                    <div
                      className={css({ maxHeight: 120, overflow: "hidden" })}
                    >
                      {log.payload.prompt}
                    </div>
                    {secondaryFields.map((field, i) => {
                      return (
                        <div
                          key={i}
                          className={css({
                            fontSize: 14,
                            color: theme.hintColor,
                            borderTop: `1px solid ${theme.divider}`,
                            paddingTop: 4,
                          })}
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
});
