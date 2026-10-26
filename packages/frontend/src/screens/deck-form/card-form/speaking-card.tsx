import { SpeakLanguage } from "api";
import { Screen } from "../../shared/screen.tsx";
import { t } from "../../../translations/t.ts";
import { td } from "../../../translations/td.tsx";
import { ButtonLink } from "../../../ui/button-link.tsx";
import { List } from "../../../ui/list.tsx";
import { LabelGroup } from "../../../ui/label-group.tsx";
import { ListRightText } from "../../../ui/list-right-text.tsx";
import { RadioSwitcher } from "../../../ui/radio-switcher.tsx";
import { CircleCheckbox } from "../../../ui/circle-checkbox.tsx";
import { languageKeyToHuman } from "../../../lib/voice-playback/speak.ts";
import { useBackButton } from "../../../lib/platform/use-back-button.ts";
import { useMainButton } from "../../../lib/platform/use-main-button.ts";
import { useProgress } from "../../../lib/platform/use-progress.tsx";
import { useCardFormStore } from "./store/card-form-store-context.tsx";
import { BackBottomButton } from "../../shared/back-bottom-button.tsx";
import { useState } from "preact/compat";
import { cn } from "../../../ui/cn.ts";
import { UrlRecordVoicePlayer } from "../../deck-review/voice-player/url-record-voice-player.ts";
import { SpeakerIcon } from "../../shared/card/card-speaker.tsx";

export function SpeakingCard() {
  const store = useCardFormStore();
  const onBack = () => store.cardInnerScreen.onChange(null);
  useBackButton(onBack);
  useMainButton(
    t("save"),
    () => store.onSaveCard(),
    () => !!store.isSaveVisible,
  );
  useProgress(() => store.isSending);

  const [recordingPlayer] = useState(() =>
    store.voiceRecordingUrl
      ? new UrlRecordVoicePlayer(store.voiceRecordingUrl)
      : null,
  );
  const language = Object.entries(SpeakLanguage).find(
    ([, value]) => value === store.speakingCardsLocale,
  )?.[0];

  return (
    <Screen title={t("speaking_card")}>
      {!recordingPlayer && (
        <LabelGroup
          description={
            <span className="inline">
              {td("card_voiceover_deck_hint", {
                link: (text) => (
                  <ButtonLink onClick={store.openDeckSpeakingSettings}>
                    {text}
                  </ButtonLink>
                ),
              })}
            </span>
          }
        >
          <List
            items={[
              {
                text: t("speaking_cards_enable"),
                isDisabled: true,
                right: (
                  <fieldset
                    disabled
                    className="flex h-6 items-center opacity-50"
                  >
                    <RadioSwitcher
                      isOn={store.isSpeakingCardsEnabled}
                      onToggle={() => {}}
                    />
                  </fieldset>
                ),
              },
              {
                text: t("voice_language"),
                isDisabled: true,
                right: language ? (
                  <ListRightText text={languageKeyToHuman(language)} />
                ) : null,
              },
            ]}
          />
        </LabelGroup>
      )}
      {(recordingPlayer || store.isSpeakingCardsEnabled) && (
        <div className={cn(!recordingPlayer && "mt-3")}>
          <LabelGroup
            title={t("card_speak_side")}
            description={t("card_speak_side_hint")}
          >
            <List
              items={(["front", "back"] as const).map((side) => ({
                text: t(side),
                onClick: () => store.setSpeakField(side),
                right: (
                  <CircleCheckbox
                    checked={store.effectiveSpeakField === side}
                    checkedClassName="bg-button"
                    onChange={() => {}}
                  />
                ),
              }))}
            />
          </LabelGroup>
        </div>
      )}
      {recordingPlayer && (
        <div className="mt-3">
          <List
            items={[
              {
                text: t("card_voice_recording"),
                right: (
                  <button
                    type="button"
                    onClick={recordingPlayer.play}
                    className="flex cursor-pointer touch-manipulation transition-[scale] duration-200 ease-out active:scale-90"
                  >
                    <SpeakerIcon
                      isPlaying={recordingPlayer.isPlaying}
                      size={24}
                    />
                  </button>
                ),
              },
            ]}
          />
        </div>
      )}
      <BackBottomButton isVisible={!store.isSaveVisible} onClick={onBack} />
    </Screen>
  );
}
