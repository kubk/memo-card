import { observer } from "mobx-react-lite";
import { Screen } from "../shared/screen.tsx";
import { t } from "../../translations/t.ts";
import { css } from "@emotion/css";
import React from "react";
import { useBackButton } from "../../lib/telegram/use-back-button.tsx";
import { useAiMassCreationStore } from "./store/ai-mass-creation-store-provider.tsx";
import { useMainButton } from "../../lib/telegram/use-main-button.tsx";
import { theme } from "../../ui/theme.tsx";

export const HowMassCreationWorksScreen = observer(() => {
  const store = useAiMassCreationStore();

  useBackButton(() => {
    store.screen.onChange(null);
  });

  useMainButton("Understood", () => {
    store.screen.onChange(null);
  });

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
        <div>
          This option allows you to generate multiple cards at once using AI and
          your own API key.
        </div>
        <div>
          <span>Example 1:</span>
          <ul
            className={css({
              paddingLeft: 24,
              marginTop: 0,
              marginBottom: 0,
            })}
          >
            <li>
              <b>Prompt</b>: Generate 3 cards with capitals of the world
            </li>
            <li>
              <b>Card front description</b>: Country
            </li>
            <li>
              <b>Card back description</b>: Capital
            </li>
          </ul>
          <div>
            You will get cards like Germany - Berlin, France - Paris, Canada -
            Ottawa
          </div>
        </div>

        <div>
          <span>Example 2:</span>
          <ul
            className={css({
              paddingLeft: 24,
              marginTop: 0,
              marginBottom: 0,
            })}
          >
            <li>
              <b>Prompt</b>: Generate 2 cards with English French words related
              to fruits
            </li>
            <li>
              <b>Card front description</b>: Fruit in English
            </li>
            <li>
              <b>Card back description</b>: Fruit in French
            </li>
          </ul>
          <div>You will get cards like Apple - Pomme, Banana - Banane</div>
        </div>
      </div>
    </Screen>
  );
});
