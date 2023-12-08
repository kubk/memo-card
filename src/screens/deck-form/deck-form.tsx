import { observer } from "mobx-react-lite";
import { css } from "@emotion/css";
import { Label } from "../../ui/label.tsx";
import { Input } from "../../ui/input.tsx";
import React from "react";
import { useMainButton } from "../../lib/telegram/use-main-button.tsx";
import { useDeckFormStore } from "../../store/deck-form-store-context.tsx";
import { screenStore } from "../../store/screen-store.ts";
import { useMount } from "../../lib/react/use-mount.ts";
import { useBackButton } from "../../lib/telegram/use-back-button.tsx";
import { useTelegramProgress } from "../../lib/telegram/use-telegram-progress.tsx";
import { assert } from "../../lib/typescript/assert.ts";
import { SettingsRow } from "../user-settings/settings-row.tsx";
import { Button } from "../../ui/button.tsx";
import { HintTransparent } from "../../ui/hint-transparent.tsx";
import { RadioSwitcher } from "../../ui/radio-switcher.tsx";
import { Select } from "../../ui/select.tsx";
import { enumEntries } from "../../lib/typescript/enum-values.ts";
import {
  languageKeyToHuman,
  SpeakLanguageEnum,
} from "../../lib/voice-playback/speak.ts";
import { DeckSpeakFieldEnum } from "../../../functions/db/deck/decks-with-cards-schema.ts";
import { theme } from "../../ui/theme.tsx";

export const DeckForm = observer(() => {
  const deckFormStore = useDeckFormStore();
  const screen = screenStore.screen;
  assert(screen.type === "deckForm");

  useMount(() => {
    deckFormStore.loadForm();
  });
  useMainButton(
    "Save",
    () => {
      deckFormStore.onDeckSave();
    },
    () => deckFormStore.isDeckSaveButtonVisible,
  );
  useBackButton(() => {
    deckFormStore.onDeckBack();
  });
  useTelegramProgress(() => deckFormStore.isSending);

  if (!deckFormStore.form) {
    return null;
  }

  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        gap: 6,
        position: "relative",
        marginBottom: 16,
      })}
    >
      <h3 className={css({ textAlign: "center" })}>
        {screen.deckId ? "Edit deck" : "Add deck"}
      </h3>
      <Label text={"Title"} isRequired>
        <Input field={deckFormStore.form.title} />
      </Label>

      <Label text={"Description"}>
        <Input
          field={deckFormStore.form.description}
          rows={3}
          type={"textarea"}
        />
      </Label>

      {deckFormStore.form.cards.length > 0 && (
        <SettingsRow
          onClick={() => {
            deckFormStore.goToCardList();
          }}
        >
          <span>Cards</span>
          <span>{deckFormStore.form.cards.length}</span>
        </SettingsRow>
      )}

      <SettingsRow>
        <span>Speaking cards</span>
        <RadioSwitcher
          isOn={deckFormStore.isSpeakingCardEnabled}
          onToggle={deckFormStore.toggleIsSpeakingCardEnabled}
        />
      </SettingsRow>
      {deckFormStore.isSpeakingCardEnabled ? (
        <div
          className={css({
            display: "flex",
            justifyContent: "space-between",
            marginLeft: 12,
            marginRight: 12,
          })}
        >
          <div>
            <div className={css({ fontSize: 14, color: theme.hintColor })}>
              Voice language
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
              Speak field
            </div>
            {deckFormStore.form.speakingCardsField.value ? (
              <Select<DeckSpeakFieldEnum>
                value={deckFormStore.form.speakingCardsField.value}
                onChange={deckFormStore.form.speakingCardsField.onChange}
                options={[
                  { value: "front", label: "Front side" },
                  { value: "back", label: "Back side" },
                ]}
              />
            ) : null}
          </div>
        </div>
      ) : (
        <>
          <HintTransparent>
            Play spoken audio for each flashcard to enhance pronunciation
          </HintTransparent>
        </>
      )}

      <div className={css({ marginTop: 18 })} />

      <Button
        onClick={() => {
          deckFormStore.openNewCardForm();
        }}
      >
        Add card
      </Button>
    </div>
  );
});
