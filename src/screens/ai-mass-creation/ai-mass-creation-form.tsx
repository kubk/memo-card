import { observer } from "mobx-react-lite";
import { useAiMassCreationStore } from "./store/ai-mass-creation-store-provider.tsx";
import { Screen } from "../shared/screen.tsx";
import { Flex } from "../../ui/flex.tsx";
import { List } from "../../ui/list.tsx";
import { FilledIcon } from "../../ui/filled-icon.tsx";
import { theme } from "../../ui/theme.tsx";
import { t } from "../../translations/t.ts";
import { Label } from "../../ui/label.tsx";
import { Input } from "../../ui/input.tsx";
import React from "react";
import { useMainButton } from "../../lib/platform/use-main-button.ts";
import { useProgress } from "../../lib/platform/use-progress.tsx";
import { useBackButton } from "../../lib/platform/use-back-button.ts";
import { screenStore } from "../../store/screen-store.ts";

export const AiMassCreationForm = observer(() => {
  const store = useAiMassCreationStore();
  const { promptForm } = store;

  useMainButton(t("ai_cards_generate"), () => {
    store.submitPromptForm();
  });

  useBackButton(() => {
    screenStore.back();
  });

  useProgress(() => store.aiMassGenerateRequest.isLoading);

  return (
    <Screen title={t("ai_cards_title")}>
      <Flex direction={"column"} gap={0}>
        <List
          items={[
            {
              text: t("how"),
              icon: (
                <FilledIcon
                  backgroundColor={theme.icons.violet}
                  icon={"mdi-help"}
                />
              ),
              onClick: () => {
                store.screen.onChange("how");
              },
            },
            {
              text: t("ai_cards_previous_prompts"),
              icon: (
                <FilledIcon
                  backgroundColor={theme.icons.turquoise}
                  icon={"mdi-history"}
                />
              ),
              onClick: () => {
                store.screen.onChange("previousPrompts");
              },
            },
          ]}
        />
      </Flex>

      <Label text={t("ai_cards_prompt")} isRequired>
        <Input field={promptForm.prompt} rows={3} type={"textarea"} />
      </Label>

      <Label isRequired text={t("ai_cards_prompt_front")}>
        <Input field={promptForm.frontPrompt} />
      </Label>

      <Label isRequired text={t("ai_cards_prompt_back")}>
        <Input field={promptForm.backPrompt} />
      </Label>

      <Label text={t("card_field_example_title")}>
        <Input field={promptForm.examplePrompt} />
      </Label>
    </Screen>
  );
});
