import { observer } from "mobx-react-lite";
import { Screen } from "../shared/screen.tsx";
import { Label } from "../../ui/label.tsx";
import { Input } from "../../ui/input.tsx";
import React from "react";
import { useAiMassCreationStore } from "./store/ai-mass-creation-store-provider.tsx";
import { HintTransparent } from "../../ui/hint-transparent.tsx";
import { ExternalLink } from "../../ui/external-link.tsx";
import { useMainButton } from "../../lib/telegram/use-main-button.tsx";
import { t } from "../../translations/t.ts";
import { SelectWithChevron } from "../../ui/select-with-chevron.tsx";
import { css } from "@emotion/css";
import { theme } from "../../ui/theme.tsx";
import { Flex } from "../../ui/flex.tsx";
import { chatGptModels } from "./store/ai-mass-creation-store.ts";
import { useBackButton } from "../../lib/telegram/use-back-button.tsx";
import { useTelegramProgress } from "../../lib/telegram/use-telegram-progress.tsx";
import { TextField } from "mobx-form-lite";

export const ApiKeysScreen = observer(() => {
  const store = useAiMassCreationStore();
  const { apiKeysForm } = store;

  useMainButton(t("save"), () => {
    store.submitApiKeysForm();
  });

  useBackButton(() => {
    store.screen.onChange(null);
  });

  useTelegramProgress(() => store.upsertUserAiCredentialsRequest.isLoading);

  const isRegularInput = store.isApiKeyRegularInput;

  return (
    <Screen title={"API keys"}>
      <Label isRequired text={"ChatGPT API key"}>
        {!isRegularInput ? (
          <div className={css({ position: "relative" })}>
            <Input isDisabled field={new TextField("*****")} />
            <span
              onClick={() => {
                console.log("update key");
                store.forceUpdateApiKey.setTrue();
              }}
              className={css({
                cursor: "pointer",
                top: 12,
                right: 16,
                position: "absolute",
                color: theme.linkColor,
              })}
            >
              Update key
            </span>
          </div>
        ) : (
          <Input field={apiKeysForm.apiKey} />
        )}

        <HintTransparent>
          Grab the key on the{" "}
          <ExternalLink href={"https://platform.openai.com/api-keys"}>
            OpenAI platform
          </ExternalLink>
        </HintTransparent>
      </Label>

      <Flex ml={12} mt={8} alignItems={"center"} gap={16}>
        <div
          className={css({
            color: theme.hintColor,
            textTransform: "uppercase",
            fontSize: 14,
          })}
        >
          Model
        </div>
        <SelectWithChevron
          value={apiKeysForm.model.value}
          onChange={(value) => {
            apiKeysForm.model.onChange(value);
          }}
          options={chatGptModels.map((model) => ({
            label: model,
            value: model,
          }))}
        />
      </Flex>
    </Screen>
  );
});
