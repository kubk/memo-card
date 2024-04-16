import { observer } from "mobx-react-lite";
import { Screen } from "../shared/screen.tsx";
import { t } from "../../translations/t.ts";
import { css } from "@emotion/css";
import React from "react";
import { useBackButton } from "../../lib/telegram/use-back-button.tsx";
import { useAiMassCreationStore } from "./store/ai-mass-creation-store-provider.tsx";
import { useMainButton } from "../../lib/telegram/use-main-button.tsx";
import { theme } from "../../ui/theme.tsx";
import { translateHowMassCreationWorksText } from "./translations.ts";

export const HowMassCreationWorksScreen = observer(() => {
  const store = useAiMassCreationStore();

  useBackButton(() => {
    store.screen.onChange(null);
  });

  useMainButton(t("understood"), () => {
    store.screen.onChange(null);
  });

  const translations = translateHowMassCreationWorksText();

  return (
    <Screen title={t("how")}>
      <div
        className={css({
          display: "flex",
          flexDirection: "column",
          gap: 16,
          padding: 16,
          background: theme.bgColor,
          borderRadius: theme.borderRadius,
        })}
      >
        <div>{translations.description}</div>
        <div>
          <span>{translations.example1}:</span>
          <ul
            className={css({
              paddingLeft: 24,
              marginTop: 0,
              marginBottom: 0,
            })}
          >
            <li>
              <b>{t("ai_cards_prompt")}</b>: {translations.promptExample1}
            </li>
            <li>
              <b>{t("ai_cards_prompt_front")}</b>: {translations.frontExample1}
            </li>
            <li>
              <b>{t("ai_cards_prompt_back")}</b>: {translations.backExample1}
            </li>
          </ul>
          <div>{translations.resultExample1}</div>
        </div>

        <div>
          <span>{translations.example2}</span>
          <ul
            className={css({
              paddingLeft: 24,
              marginTop: 0,
              marginBottom: 0,
            })}
          >
            <li>
              <b>{t("ai_cards_prompt")}</b>: {translations.promptExample2}
            </li>
            <li>
              <b>{t("ai_cards_prompt_front")}</b>: {translations.frontExample2}
            </li>
            <li>
              <b>{t("ai_cards_prompt_back")}</b>: {translations.backExample2}
            </li>
          </ul>
          <div>{translations.resultExample2}</div>
        </div>
      </div>
    </Screen>
  );
});
