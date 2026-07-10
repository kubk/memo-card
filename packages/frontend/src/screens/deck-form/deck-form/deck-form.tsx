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
  WandSparklesIcon,
  KeyboardIcon,
  PlusIcon,
  CopyIcon,
  ShareIcon,
  TrashIcon,
  FilesIcon,
  UploadIcon,
} from "lucide-react";
import { FilledIcon, TransparentIcon } from "../../../ui/filled-icon.tsx";
import { ButtonGrid } from "../../../ui/button-grid.tsx";
import { ButtonSideAligned } from "../../../ui/button-side-aligned.tsx";
import { shareMemoCardUrl } from "../../shared/share-memo-card-url.tsx";
import { aiMassCreationDraftStore } from "../../ai-mass-creation/store/ai-mass-creation-draft-store.ts";

export function DeckForm() {
  const deckFormStore = useDeckFormStore();
  const screen = screenStore.screen;
  assert(screen.type === "deckForm");

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

  useBackButton(() => {
    deckFormStore.executeViaConfirm(() => {
      screenStore.back();
    });
  }, []);

  useProgress(() => deckFormStore.isSending);

  if (!deckFormStore.deckForm) {
    return null;
  }

  return (
    <Screen
      title={screen.deckId ? t("edit_deck") : t("add_deck")}
      subtitle={
        screen.folder ? (
          <div className="text-center text-sm">
            {t("folder")}{" "}
            <button
              onClick={() => {
                deckFormStore.executeViaConfirm(() => {
                  assert(screen.folder, "Folder should be defined");
                  screenStore.push({
                    type: "folderPreview",
                    folderId: screen.folder.id,
                  });
                });
              }}
              className="reset-button text-inherit text-link"
            >
              {screen.folder.name}
            </button>
          </div>
        ) : undefined
      }
    >
      <Label text={t("title")} isRequired>
        <Input field={deckFormStore.deckForm.title} />
      </Label>

      <Label isPlain text={t("description")} slotRight={<FormattingSwitcher />}>
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
        <ButtonGrid>
          <ButtonSideAligned
            icon={<WandSparklesIcon size={24} />}
            outline
            onClick={() => {
              userStore.executeViaPaywall("bulk_ai_cards", () => {
                assert(deckFormStore.deckForm, "Deck form should be defined");
                aiMassCreationDraftStore.setDeckDraft({
                  description: deckFormStore.deckForm.description.value,
                  folderId: deckFormStore.deckForm.folderId,
                });
                screenStore.push({ type: "aiMassCreation" });
              });
            }}
          >
            {t("ai_cards_title")}
          </ButtonSideAligned>

          <ButtonSideAligned
            icon={<UploadIcon size={24} />}
            outline
            onClick={() => {
              screenStore.replace({ type: "ankiImport" });
            }}
          >
            {t("anki_import_entry_button")}
          </ButtonSideAligned>
        </ButtonGrid>
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
        <div className="mb-2.5">
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
                text: t("card_input_mode_screen"),
                icon: (
                  <FilledIcon
                    backgroundColor={theme.icons.sea}
                    icon={<KeyboardIcon size={18} className="text-white" />}
                  />
                ),
                onClick: () => {
                  userStore.executeViaPaywall("individual_ai_card", () => {
                    deckFormStore.goCardInputMode();
                  });
                },
                right: <WithProIcon />,
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

      {deckFormStore.deckForm?.id && (
        <ButtonGrid>
          <ButtonSideAligned
            icon={<ShareIcon size={24} />}
            outline
            onClick={() => {
              assert(screen.type === "deckForm");
              const deckId = screen.deckId;
              if (!deckId) return;
              const deck = deckListStore.searchDeckById(deckId);
              if (!deck) return;

              shareMemoCardUrl(deck.shareId);
            }}
          >
            {t("share")}
          </ButtonSideAligned>

          <ButtonSideAligned
            icon={<TrashIcon size={24} />}
            outline
            onClick={() => {
              assert(screen.type === "deckForm");
              const deckId = screen.deckId;
              if (!deckId) return;
              const deck = deckListStore.searchDeckById(deckId);
              if (!deck) return;

              deckListStore.removeDeck(deck);
            }}
          >
            {t("delete")}
          </ButtonSideAligned>

          <ButtonSideAligned
            icon={<CopyIcon size={24} />}
            isPro
            outline
            onClick={() => {
              if (deckFormStore.deckForm?.id) {
                deckListStore.onDuplicateDeck(deckFormStore.deckForm.id);
              }
            }}
          >
            {t("duplicate")}
          </ButtonSideAligned>
        </ButtonGrid>
      )}

      <div className="mt-[18px]" />
    </Screen>
  );
}
