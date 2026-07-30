import { Label } from "../../../ui/label.tsx";
import { Input } from "../../../ui/input.tsx";
import { useMainButton } from "../../../lib/platform/use-main-button.ts";
import { useDeckFormStore } from "./store/deck-form-store-context.tsx";
import { screenStore } from "../../../store/screen-store.ts";
import { useBackButton } from "../../../lib/platform/use-back-button.ts";
import { useProgress } from "../../../lib/platform/use-progress.tsx";
import { theme } from "../../../ui/theme.tsx";
import { t } from "../../../translations/t.ts";
import { deckListStore } from "../../../store/deck-list-store.ts";
import { Screen } from "../../shared/screen.tsx";
import { ListHeader } from "../../../ui/list-header.tsx";
import { List } from "../../../ui/list.tsx";
import { ListRightText } from "../../../ui/list-right-text.tsx";
import { RadioSwitcher } from "../../../ui/radio-switcher.tsx";
import { userStore } from "../../../store/user-store.ts";
import { assert } from "api";
import { WithProIcon } from "../../shared/with-pro-icon.tsx";
import { FormattingSwitcher } from "../card-form/formatting-switcher.tsx";
import { WysiwygField } from "../../../ui/wysiwyg-field/wysiwig-field.tsx";
import {
  LayersIcon,
  MicIcon,
  PlusIcon,
  FilesIcon,
  UploadIcon,
} from "lucide-react";
import { FilledIcon, TransparentIcon } from "../../../ui/filled-icon.tsx";
import { DeckActions } from "../../shared/deck-actions.tsx";
import { BackBottomButton } from "../../shared/back-bottom-button.tsx";
import { McpSettingsEntry } from "../../mcp-settings/mcp-settings-entry.tsx";
import { mcpT } from "../../mcp-settings/translations.ts";
import { ChevronIcon } from "../../../ui/chevron-icon.tsx";

export function DeckForm() {
  const deckFormStore = useDeckFormStore();
  const screen = screenStore.screen;
  assert(screen.type === "deckForm");

  const handleBack = () => {
    deckFormStore.executeViaConfirm(() => {
      screenStore.back();
    });
  };

  useMainButton(
    t("save"),
    () => {
      const isNewDeck = !screen.deckId;
      deckFormStore.onDeckSave((deck) => {
        if (!isNewDeck) return;
        screenStore.replace({ type: "deckForm", deckId: deck.id });
      });
    },
    () => deckFormStore.isSaveVisible,
  );

  useBackButton(handleBack, []);

  useProgress(() => deckFormStore.isSending);

  if (!deckFormStore.deckForm) {
    return null;
  }

  const deck = screen.deckId
    ? deckListStore.searchDeckById(screen.deckId)
    : null;
  const folderId = screen.folderId;
  const folderName = screen.folderName;

  return (
    <>
      <Screen
        title={screen.deckId ? t("edit_deck") : t("add_deck")}
        subtitle={
          folderId && folderName ? (
            <div className="text-center text-sm">
              {t("folder")}{" "}
              <button
                onClick={() => {
                  deckFormStore.executeViaConfirm(() => {
                    screenStore.push({
                      type: "folderPreview",
                      folderId,
                    });
                  });
                }}
                className="reset-button text-inherit text-link"
              >
                {folderName}
              </button>
            </div>
          ) : undefined
        }
      >
        <Label text={t("title")} isRequired>
          <Input field={deckFormStore.deckForm.title} />
        </Label>

        <Label
          isPlain
          text={t("description")}
          slotRight={<FormattingSwitcher />}
        >
          {userStore.isCardFormattingOn.value ? (
            <WysiwygField
              field={deckFormStore.deckForm.description}
              allowImage={false}
            />
          ) : (
            <Input
              field={deckFormStore.deckForm.description}
              type={"textarea"}
              rows={3}
            />
          )}
        </Label>

        {!deckFormStore.deckForm?.id && (
          <McpSettingsEntry
            title={mcpT("createCardsTitle")}
            trailingItems={[
              {
                icon: (
                  <FilledIcon
                    backgroundColor={theme.icons.blue}
                    icon={<UploadIcon size={18} />}
                  />
                ),
                text: t("anki_import_entry_button"),
                right: <ChevronIcon direction="right" className="text-hint" />,
                onClick: () => {
                  screenStore.replace({ type: "ankiImport" });
                },
              },
            ]}
          />
        )}

        {deckFormStore.deckForm?.id && (
          <List
            items={[
              {
                icon: (
                  <FilledIcon
                    backgroundColor={theme.icons.violet}
                    icon={<LayersIcon size={18} className="text-white" />}
                  />
                ),
                text: t("cards"),
                onClick: () => {
                  deckFormStore.goToCardList();
                },
                right: (
                  <span className="text-hint">
                    {deckFormStore.deckForm.cards.length}
                  </span>
                ),
              },
              {
                icon: (
                  <TransparentIcon
                    icon={<PlusIcon size={24} className="text-link" />}
                  />
                ),
                text: t("add_card"),
                isLinkColor: true,
                onClick: () => {
                  deckFormStore.navigateToNewCard();
                },
              },
            ]}
          />
        )}

        {deckFormStore.deckForm?.id && (
          <div>
            <ListHeader text={t("advanced")} />
            <List
              items={[
                {
                  text: t("speaking_cards"),
                  icon: (
                    <FilledIcon
                      backgroundColor={theme.icons.blue}
                      icon={<MicIcon size={18} className="text-white" />}
                    />
                  ),
                  onClick: () => {
                    deckFormStore.goToSpeakingCards();
                  },
                  right: (
                    <ListRightText
                      text={
                        deckFormStore.deckForm.speakingCardsLocale.value
                          ? t("is_on")
                          : t("is_off")
                      }
                      chevron
                    />
                  ),
                },
                {
                  text: t("reverse_cards"),
                  icon: (
                    <FilledIcon
                      backgroundColor={theme.icons.green}
                      icon={<FilesIcon size={18} className="text-white" />}
                    />
                  ),
                  onClick: () => {
                    userStore.executeViaPaywall("reverse_cards", () => {
                      deckFormStore.deckForm?.reverseCards.toggle();
                    });
                  },
                  right: (
                    <WithProIcon>
                      <RadioSwitcher
                        isOn={deckFormStore.deckForm.reverseCards.value}
                        onToggle={() => {
                          userStore.executeViaPaywall("reverse_cards", () => {
                            deckFormStore.deckForm?.reverseCards.toggle();
                          });
                        }}
                      />
                    </WithProIcon>
                  ),
                },
              ]}
            />
          </div>
        )}

        {deck && (
          <div className="mt-3">
            <DeckActions deck={deck} variant="buttons" />
          </div>
        )}

        <div className="mt-[18px]" />
      </Screen>

      <BackBottomButton
        isVisible={!deckFormStore.isSaveVisible}
        onClick={handleBack}
      />
    </>
  );
}
