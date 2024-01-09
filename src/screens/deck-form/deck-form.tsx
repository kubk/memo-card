import { observer } from "mobx-react-lite";
import { css, cx } from "@emotion/css";
import { Label } from "../../ui/label.tsx";
import { Input } from "../../ui/input.tsx";
import React from "react";
import { useMainButton } from "../../lib/telegram/use-main-button.tsx";
import { useDeckFormStore } from "./store/deck-form-store-context.tsx";
import { screenStore } from "../../store/screen-store.ts";
import { useMount } from "../../lib/react/use-mount.ts";
import { useBackButton } from "../../lib/telegram/use-back-button.tsx";
import { useTelegramProgress } from "../../lib/telegram/use-telegram-progress.tsx";
import { assert } from "../../lib/typescript/assert.ts";
import { CardRow } from "../../ui/card-row.tsx";
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
import { t } from "../../translations/t.ts";
import { deckListStore } from "../../store/deck-list-store.ts";
import { reset } from "../../ui/reset.ts";
import { Screen } from "../shared/screen.tsx";
import { CenteredUnstyledButton } from "../../ui/centered-unstyled-button.tsx";

export const DeckForm = observer(() => {
  const deckFormStore = useDeckFormStore();
  const screen = screenStore.screen;
  assert(screen.type === "deckForm");

  useMount(() => {
    deckFormStore.loadForm();
  });
  useMainButton(
    t("save"),
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
    <Screen
      title={screen.deckId ? t("edit_deck") : t("add_deck")}
      subtitle={
        screen.folder ? (
          <div className={css({ textAlign: "center", fontSize: 14 })}>
            to folder{" "}
            <button
              onClick={() => {
                assert(screen.folder, "Folder should be defined");
                screenStore.go({
                  type: "folderPreview",
                  folderId: screen.folder.id,
                });
              }}
              className={cx(
                reset.button,
                css({ fontSize: "inherit", color: theme.linkColor }),
              )}
            >
              {screen.folder.name}
            </button>
          </div>
        ) : undefined
      }
    >
      <Label text={t("title")} isRequired>
        <Input field={deckFormStore.form.title} />
      </Label>

      <Label text={t("description")}>
        <Input
          field={deckFormStore.form.description}
          rows={3}
          type={"textarea"}
        />
      </Label>

      {deckFormStore.form.cards.length > 0 && (
        <CardRow
          onClick={() => {
            deckFormStore.goToCardList();
          }}
        >
          <span>{t("cards")}</span>
          <span>{deckFormStore.form.cards.length}</span>
        </CardRow>
      )}

      <CardRow>
        <span>{t("speaking_cards")}</span>
        <RadioSwitcher
          isOn={deckFormStore.isSpeakingCardEnabled}
          onToggle={deckFormStore.toggleIsSpeakingCardEnabled}
        />
      </CardRow>
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
                  { value: "front", label: t("card_speak_side_front") },
                  { value: "back", label: t("card_speak_side_back") },
                ]}
              />
            ) : null}
          </div>
        </div>
      ) : (
        <>
          <HintTransparent>{t("card_speak_description")}</HintTransparent>
        </>
      )}

      <div className={css({ marginTop: 18 })} />

      <Button
        icon={"mdi mdi-plus"}
        onClick={() => {
          deckFormStore.openNewCardForm();
        }}
      >
        {t("add_card")}
      </Button>
      {deckFormStore.form.id ? (
        <CenteredUnstyledButton
          onClick={() => {
            assert(deckFormStore.form);
            assert(deckFormStore.form.id);
            deckListStore.goDeckById(deckFormStore.form.id, "main");
          }}
        >
          {t("deck_preview")}
        </CenteredUnstyledButton>
      ) : null}
    </Screen>
  );
});
