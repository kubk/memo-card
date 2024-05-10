import { observer } from "mobx-react-lite";
import { Screen } from "../shared/screen.tsx";
import { t } from "../../translations/t.ts";
import { CardRow } from "../../ui/card-row.tsx";
import { RadioSwitcher } from "../../ui/radio-switcher.tsx";
import { Flex } from "../../ui/flex.tsx";
import { css } from "@emotion/css";
import { theme } from "../../ui/theme.tsx";
import { Select } from "../../ui/select.tsx";
import { enumEntries } from "../../lib/typescript/enum-values.ts";
import {
  languageKeyToHuman,
  SpeakLanguageEnum,
} from "../../lib/voice-playback/speak.ts";
import { DeckSpeakFieldEnum } from "../../../functions/db/deck/decks-with-cards-schema.ts";
import { HintTransparent } from "../../ui/hint-transparent.tsx";
import React from "react";
import { useBackButton } from "../../lib/platform/use-back-button.ts";
import { useMainButton } from "../../lib/platform/use-main-button.ts";
import { useDeckFormStore } from "./store/deck-form-store-context.tsx";

export const SpeakingCards = observer(() => {
  const deckFormStore = useDeckFormStore();

  if (!deckFormStore.form) {
    return null;
  }

  useBackButton(() => {
    deckFormStore.quitInnerScreen();
  });

  useMainButton(t("go_back"), () => {
    deckFormStore.quitInnerScreen();
  });

  return (
    <Screen title={t("speaking_cards")}>
      <CardRow>
        <span>{t("speaking_cards")}</span>
        <RadioSwitcher
          isOn={deckFormStore.isSpeakingCardEnabled}
          onToggle={deckFormStore.toggleIsSpeakingCardEnabled}
        />
      </CardRow>
      <HintTransparent>{t("card_speak_description")}</HintTransparent>

      {deckFormStore.isSpeakingCardEnabled ? (
        <Flex justifyContent={"space-between"} ml={12} mr={12}>
          <div>
            <div className={css({ fontSize: 14, color: theme.hintColor })}>
              {t("voice_language")}
            </div>
            {deckFormStore.form.speakingCardsLocale.value ? (
              <Select<string>
                value={deckFormStore.form.speakingCardsLocale.value}
                onChange={deckFormStore.form.speakingCardsLocale.onChange}
                options={enumEntries(SpeakLanguageEnum).map(([name, key]) => ({
                  value: key,
                  label: languageKeyToHuman(name),
                }))}
              />
            ) : null}
          </div>

          <div>
            <div className={css({ fontSize: 14, color: theme.hintColor })}>
              {t("card_speak_side")}
            </div>
            {deckFormStore.form.speakingCardsField.value ? (
              <Select<DeckSpeakFieldEnum>
                value={deckFormStore.form.speakingCardsField.value}
                onChange={deckFormStore.form.speakingCardsField.onChange}
                options={[
                  { value: "front", label: t("front") },
                  { value: "back", label: t("back") },
                ]}
              />
            ) : null}
          </div>
        </Flex>
      ) : null}
    </Screen>
  );
});
