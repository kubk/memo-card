import { Screen } from "../../shared/screen.tsx";
import { t } from "../../../translations/t.ts";
import { Flex } from "../../../ui/flex.tsx";
import { Select } from "../../../ui/select.tsx";
import { enumEntries } from "../../../lib/typescript/enum-values.ts";
import {
  languageKeyToHuman,
  SpeakLanguageEnum,
} from "../../../lib/voice-playback/speak.ts";
import { DeckSpeakFieldEnum } from "api";
import { useBackButton } from "../../../lib/platform/use-back-button.ts";
import { useMainButton } from "../../../lib/platform/use-main-button.ts";
import { useDeckFormStore } from "./store/deck-form-store-context.tsx";
import { useProgress } from "../../../lib/platform/use-progress.tsx";
import { userStore } from "../../../store/user-store.ts";
import { RadioList } from "../../../ui/radio-list/radio-list.tsx";
import { WithProIcon } from "../../shared/with-pro-icon.tsx";
import type { VoiceType } from "./store/deck-form-store.ts";

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
      <RadioList<VoiceType>
        selectedId={deckFormStore.voiceType}
        options={[
          {
            id: "none",
            title: t("voice_type_none"),
          },
          {
            id: "robotic",
            title: t("ai_speech_preview_free_title"),
            description: t("ai_speech_preview_free_desc"),
          },
          {
            id: "ai",
            title: (
              <Flex
                fullWidth
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <span>{t("ai_speech_preview_pro_title")}</span>
                <WithProIcon />
              </Flex>
            ),
            description: t("ai_speech_preview_pro_desc"),
          },
        ]}
        onChange={(type) => {
          // Handle paywall for AI option
          if (type === "ai" && !userStore.isPaid) {
            userStore.executeViaPaywall("individual_ai_card", () => {
              deckFormStore.setVoiceType(type);
            });
          } else {
            deckFormStore.setVoiceType(type);
          }
        }}
      />

      {(deckFormStore.voiceType === "robotic" ||
        deckFormStore.voiceType === "ai") && (
        <Flex justifyContent={"space-between"} ml={12} mr={12} mt={16}>
          <div>
            <div className="text-sm text-hint">{t("voice_language")}</div>
            {deckFormStore.deckForm.speakingCardsLocale.value ? (
              <Select<string>
                value={deckFormStore.deckForm.speakingCardsLocale.value}
                onChange={deckFormStore.deckForm.speakingCardsLocale.onChange}
                options={enumEntries(SpeakLanguageEnum).map(([name, key]) => ({
                  value: key,
                  label: languageKeyToHuman(name),
                }))}
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
      )}
    </Screen>
  );
}
