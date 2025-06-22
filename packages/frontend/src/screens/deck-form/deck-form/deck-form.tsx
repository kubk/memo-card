import { Label } from "../../../ui/label.tsx";
import { Input } from "../../../ui/input.tsx";
import { useEffect } from "react";
import { useMainButton } from "../../../lib/platform/use-main-button.ts";
import { useDeckFormStore } from "./store/deck-form-store-context.tsx";
import { screenStore } from "../../../store/screen-store.ts";
import { useMount } from "../../../lib/react/use-mount.ts";
import { useBackButton } from "../../../lib/platform/use-back-button.ts";
import { useProgress } from "../../../lib/platform/use-progress.tsx";
import { theme } from "../../../ui/theme.tsx";
import { t } from "../../../translations/t.ts";
import { deckListStore } from "../../../store/deck-list-store.ts";
import { Screen } from "../../shared/screen.tsx";
import { ListHeader } from "../../../ui/list-header.tsx";
import { List } from "../../../ui/list.tsx";
import { ListRightText } from "../../../ui/list-right-text.tsx";
import { boolNarrow } from "../../../lib/typescript/bool-narrow.ts";
import { isFormValid } from "mobx-form-lite";
import { userStore } from "../../../store/user-store.ts";
import { assert } from "api";
import { WithProIcon } from "../../shared/with-pro-icon.tsx";
import { suitableCardInputModeStore } from "../../../store/suitable-card-input-mode-store.ts";
import { FormattingSwitcher } from "../card-form/formatting-switcher.tsx";
import { WysiwygField } from "../../../ui/wysiwyg-field/wysiwig-field.tsx";
import {
  LayersIcon,
  MicIcon,
  BotIcon,
  ListIcon,
  KeyboardIcon,
  PlusIcon,
  CopyIcon,
  ShareIcon,
  TrashIcon,
} from "lucide-react";
import { FilledIcon, TransparentIcon } from "../../../ui/filled-icon.tsx";
import { ButtonGrid } from "../../../ui/button-grid.tsx";
import { ButtonSideAligned } from "../../../ui/button-side-aligned.tsx";
import { shareMemoCardUrl } from "../../shared/share-memo-card-url.tsx";
import { MoreFeaturesButton } from "../../shared/feature-preview/more-features-button.tsx";

export function DeckForm() {
  const deckFormStore = useDeckFormStore();
  const screen = screenStore.screen;
  assert(screen.type === "deckForm");

  useMount(() => {
    suitableCardInputModeStore.load();
  });

  useEffect(() => {
    deckFormStore.loadForm();
  }, [deckFormStore, screen.index]);

  useMainButton(
    t("save"),
    () => {
      deckFormStore.onDeckSave((deck) => {
        screenStore.restoreHistory();
        screenStore.goToDeckForm({ deckId: deck.id });
      });
    },
    undefined,
    [screen.index],
  );

  useBackButton(() => {
    deckFormStore.onDeckBack(() => {
      screenStore.back();
    });
  }, [screen.index]);

  useProgress(() => deckFormStore.isSending);

  if (!deckFormStore.deckForm) {
    console.log("Deck form is not loaded");
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
                deckFormStore.onDeckBack(() => {
                  assert(screen.folder, "Folder should be defined");
                  screenStore.go({
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
          <WysiwygField field={deckFormStore.deckForm.description} />
        ) : (
          <Input
            field={deckFormStore.deckForm.description}
            type={"textarea"}
            rows={3}
          />
        )}
      </Label>

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
                deckFormStore.openNewCardForm();
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
                text: t("ai_cards_title"),
                icon: (
                  <FilledIcon
                    backgroundColor={theme.icons.turquoise}
                    icon={<BotIcon size={18} className="text-white" />}
                  />
                ),
                onClick: () => {
                  userStore.executeViaPaywall("bulk_ai_cards", () => {
                    if (
                      !deckFormStore.deckForm ||
                      !isFormValid(deckFormStore.deckForm)
                    ) {
                      return;
                    }
                    const deckId = deckFormStore.deckForm.id;
                    assert(deckId, "Deck id should be defined");
                    screenStore.go({
                      type: "aiMassCreation",
                      deckId: deckId,
                      deckTitle: deckFormStore.deckForm.title.value,
                    });
                  });
                },
                right: <WithProIcon />,
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
              userStore.canUpdateCatalogSettings
                ? {
                    text: "Catalog",
                    icon: (
                      <FilledIcon
                        backgroundColor={theme.orange}
                        icon={<ListIcon size={18} className="text-white" />}
                      />
                    ),
                    onClick: () => {
                      const deckId = deckFormStore.deckForm?.id;
                      assert(deckId, "Deck id should be defined");
                      screenStore.go({
                        type: "catalogSettings",
                        itemType: "deck",
                        id: deckId,
                      });
                    },
                  }
                : undefined,
            ].filter(boolNarrow)}
          />
        </div>
      )}

      {deckFormStore.deckForm?.id && (
        <ButtonGrid>
          <ButtonSideAligned
            icon={<CopyIcon size={24} />}
            outline
            onClick={() => {
              if (deckFormStore.deckForm?.id) {
                deckListStore.onDuplicateDeck(deckFormStore.deckForm.id);
              }
            }}
          >
            {t("duplicate")}
          </ButtonSideAligned>

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

          <MoreFeaturesButton />
        </ButtonGrid>
      )}

      <div className="mt-[18px]" />
    </Screen>
  );
}
