import { Screen } from "../../shared/screen.tsx";
import { t } from "../../../translations/t.ts";
import { List } from "../../../ui/list.tsx";
import { ListHeader } from "../../../ui/list-header.tsx";
import { ListRightText } from "../../../ui/list-right-text.tsx";
import { RadioSwitcher } from "../../../ui/radio-switcher.tsx";
import { CircleCheckbox } from "../../../ui/circle-checkbox.tsx";
import { HintTransparent } from "../../../ui/hint-transparent.tsx";
import { enumEntries } from "../../../lib/typescript/enum-values.ts";
import { languageKeyToHuman } from "../../../lib/voice-playback/speak.ts";
import { SpeakLanguage } from "api";
import { useBackButton } from "../../../lib/platform/use-back-button.ts";
import { useMainButton } from "../../../lib/platform/use-main-button.ts";
import { useDeckFormStore } from "./store/deck-form-store-context.tsx";
import { useProgress } from "../../../lib/platform/use-progress.tsx";

const languageOptions = enumEntries(SpeakLanguage).map(([name, value]) => ({
  value,
  label: languageKeyToHuman(name),
}));

export function SpeakingCards() {
  const deckFormStore = useDeckFormStore();

  useBackButton(() => {
    deckFormStore.quitSpeakingCardsScreen();
  });

  useMainButton(t("save"), () => {
    deckFormStore.saveSpeakingCards();
  });

  useProgress(() => deckFormStore.isSending);

  const deckForm = deckFormStore.deckForm;
  if (!deckForm) {
    return null;
  }

  const { speakingCardsLocale, speakingCardsField } = deckForm;
  const isSpeakingCardsEnabled = deckFormStore.isSpeakingCardsEnabled;
  const isFrontSide = speakingCardsField.value === "front";

  return (
    <Screen title={t("speaking_cards")}>
      <List
        items={[
          {
            text: t("speaking_cards_enable"),
            onClick: deckFormStore.toggleSpeakingCards,
            right: (
              <div className="flex h-6 items-center">
                <RadioSwitcher
                  isOn={isSpeakingCardsEnabled}
                  onToggle={deckFormStore.toggleSpeakingCards}
                />
              </div>
            ),
          },
          {
            text: t("voice_language"),
            isDisabled: !isSpeakingCardsEnabled,
            right:
              isSpeakingCardsEnabled && speakingCardsLocale.value ? (
                <LanguageSelect
                  value={speakingCardsLocale.value}
                  onChange={speakingCardsLocale.onChange}
                />
              ) : null,
          },
        ]}
      />

      {isSpeakingCardsEnabled && (
        <div className="mt-3">
          <ListHeader text={t("card_speak_side")} />
          <List
            items={[
              {
                text: t("front"),
                onClick: () => {
                  speakingCardsField.onChange("front");
                },
                right: (
                  <CircleCheckbox
                    checked={isFrontSide}
                    checkedClassName={"bg-button"}
                    onChange={() => {}}
                  />
                ),
              },
              {
                text: t("back"),
                onClick: () => {
                  speakingCardsField.onChange("back");
                },
                right: (
                  <CircleCheckbox
                    checked={!isFrontSide}
                    checkedClassName={"bg-button"}
                    onChange={() => {}}
                  />
                ),
              },
            ]}
          />
          <HintTransparent>{t("card_speak_side_hint")}</HintTransparent>
        </div>
      )}
    </Screen>
  );
}

function LanguageSelect({
  value,
  onChange,
}: {
  value: SpeakLanguage;
  onChange: (value: SpeakLanguage) => void;
}) {
  const label =
    languageOptions.find((option) => option.value === value)?.label ?? "";

  return (
    <div className="flex items-center gap-1">
      <ListRightText text={label} chevron />
      <select
        className="absolute inset-0 cursor-pointer appearance-none border-none bg-transparent opacity-0 outline-none"
        value={value}
        onChange={(event) => {
          onChange(event.target.value as SpeakLanguage);
        }}
      >
        {languageOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
