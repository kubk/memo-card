import { observer } from "mobx-react-lite";
import { t } from "../../translations/t.ts";
import { css } from "@emotion/css";
import React from "react";
import { useAiMassCreationStore } from "./store/ai-mass-creation-store-provider.tsx";
import { theme } from "../../ui/theme.tsx";
import { translateHowMassCreationWorksText } from "./translations.ts";
import { BottomSheet } from "../../ui/bottom-sheet/bottom-sheet.tsx";
import { BottomSheetTitle } from "../../ui/bottom-sheet/bottom-sheet-title.tsx";

export const HowMassCreationWorksBottomSheet = observer(() => {
  const store = useAiMassCreationStore();
  const translations = translateHowMassCreationWorksText();
  const onClose = () => {
    store.screen.onChange(null);
  };

  return (
    <BottomSheet isOpen={store.screen.value === "how"} onClose={onClose}>
      <>
        <BottomSheetTitle title={t("how")} onClose={onClose} />
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
                <b>{t("ai_cards_prompt_front")}</b>:{" "}
                {translations.frontExample1}
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
                <b>{t("ai_cards_prompt_front")}</b>:{" "}
                {translations.frontExample2}
              </li>
              <li>
                <b>{t("ai_cards_prompt_back")}</b>: {translations.backExample2}
              </li>
            </ul>
            <div>{translations.resultExample2}</div>
          </div>
        </div>
      </>
    </BottomSheet>
  );
});
