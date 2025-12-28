import { Screen } from "../../shared/screen.tsx";
import { t } from "../../../translations/t.ts";
import { CardRow } from "../../../ui/card-row.tsx";
import { RadioSwitcher } from "../../../ui/radio-switcher.tsx";
import { Flex } from "../../../ui/flex.tsx";
import { Select } from "../../../ui/select.tsx";
import { enumEntries } from "../../../lib/typescript/enum-values.ts";
import {
  languageKeyToHuman,
  SpeakLanguageEnum,
} from "../../../lib/voice-playback/speak.ts";
import { DeckSpeakFieldEnum } from "api";
import { HintTransparent } from "../../../ui/hint-transparent.tsx";
import { useBackButton } from "../../../lib/platform/use-back-button.ts";
import { useMainButton } from "../../../lib/platform/use-main-button.ts";
import { useDeckFormStore } from "./store/deck-form-store-context.tsx";
import { useProgress } from "../../../lib/platform/use-progress.tsx";
import { userStore } from "../../../store/user-store.ts";

export function SpeakingCards() {
  const deckFormStore = useDeckFormStore();

  useBackButton(() => {
    deckFormStore.quitSpeakingCardsScreen();
  });

  useMainButton(t("save"), () => {
    deckFormStore.saveSpeakingCards();
  });

  useProgress(() => deckFormStore.isSending);

  if (!deckFormStore.deckForm) {
    return null;
  }

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
        <>
          <Flex justifyContent={"space-between"} ml={12} mr={12}>
            <div>
              <div className="text-sm text-hint">{t("voice_language")}</div>
              {deckFormStore.deckForm.speakingCardsLocale.value ? (
                <Select<string>
                  value={deckFormStore.deckForm.speakingCardsLocale.value}
                  onChange={deckFormStore.deckForm.speakingCardsLocale.onChange}
                  options={enumEntries(SpeakLanguageEnum).map(
                    ([name, key]) => ({
                      value: key,
                      label: languageKeyToHuman(name),
                    }),
                  )}
                />
              ) : null}
            </div>

            <div>
              <div className="text-sm text-hint">{t("card_speak_side")}</div>
              {deckFormStore.deckForm.speakingCardsField.value ? (
                <Select<DeckSpeakFieldEnum>
                  value={deckFormStore.deckForm.speakingCardsField.value}
                  onChange={deckFormStore.deckForm.speakingCardsField.onChange}
                  options={[
                    { value: "front", label: t("front") },
                    { value: "back", label: t("back") },
                  ]}
                />
              ) : null}
            </div>
          </Flex>

          {userStore.isPaid ? (
            <>
              <CardRow>
                <span>{t("ai_speech_preview_pro_title")}</span>
                <RadioSwitcher
                  isOn={deckFormStore.deckForm.speakAutoAi.value}
                  onToggle={deckFormStore.deckForm.speakAutoAi.toggle}
                />
              </CardRow>
              <HintTransparent>
                {t("speak_auto_ai_description")}
              </HintTransparent>
            </>
          ) : null}
        </>
      ) : null}
    </Screen>
  );
}
