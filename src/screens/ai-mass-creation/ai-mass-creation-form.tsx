import { observer } from "mobx-react-lite";
import { useAiMassCreationStore } from "./store/ai-mass-creation-store-provider.tsx";
import { Screen } from "../shared/screen.tsx";
import { Flex } from "../../ui/flex.tsx";
import { List } from "../../ui/list.tsx";
import { FilledIcon } from "../../ui/filled-icon.tsx";
import { theme } from "../../ui/theme.tsx";
import { ListRightText } from "../../ui/list-right-text.tsx";
import { t } from "../../translations/t.ts";
import { Label } from "../../ui/label.tsx";
import { Input } from "../../ui/input.tsx";
import React from "react";
import { ValidationError } from "../../ui/validation-error.tsx";
import { useMainButton } from "../../lib/telegram/use-main-button.tsx";
import { useTelegramProgress } from "../../lib/telegram/use-telegram-progress.tsx";

export const AiMassCreationForm = observer(() => {
  const store = useAiMassCreationStore();
  const { promptForm } = store;

  useMainButton("Generate cards", () => {
    store.submitPromptForm();
  });

  useTelegramProgress(() => store.aiMassGenerateRequest.isLoading);

  return (
    <Screen title={"Generate cards with AI"}>
      <Flex direction={"column"} gap={0}>
        <List
          items={[
            {
              text: t("how"),
              icon: (
                <FilledIcon
                  backgroundColor={theme.icons.turquoise}
                  icon={"mdi-help"}
                />
              ),
              onClick: () => {
                store.screen.onChange("how");
              },
            },
            {
              text: "API keys",
              icon: (
                <FilledIcon
                  backgroundColor={theme.icons.blue}
                  icon={"mdi-key"}
                />
              ),
              right: (
                <ListRightText
                  text={
                    store.isApiKeysSetRequest.isLoading
                      ? t("ui_loading")
                      : store.isApiKeysSet
                      ? "Configured"
                      : "Not configured"
                  }
                />
              ),
              onClick: () => {
                store.goApiKeysScreen();
              },
            },
          ]}
        />
        {promptForm.apiKey.isTouched && promptForm.apiKey.error && (
          <ValidationError error={promptForm.apiKey.error} />
        )}
      </Flex>

      <Label text={"Prompt"} isRequired>
        <Input field={promptForm.prompt} rows={3} type={"textarea"} />
      </Label>

      <Label isRequired text={"Card front description"}>
        <Input field={promptForm.frontPrompt} />
      </Label>

      <Label isRequired text={"Card back description"}>
        <Input field={promptForm.backPrompt} />
      </Label>
    </Screen>
  );
});
