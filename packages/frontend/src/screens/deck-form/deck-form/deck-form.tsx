import { ButtonLink } from "../../../ui/button-link.tsx";
import { LabelGroup } from "../../../ui/label-group.tsx";
import { Input } from "../../../ui/input.tsx";
import { useMainButton } from "../../../lib/platform/use-main-button.ts";
import { useDeckFormStore } from "./store/deck-form-store-context.tsx";
import { screenStore } from "../../../store/screen-store.ts";
import { useBackButton } from "../../../lib/platform/use-back-button.ts";
import { useProgress } from "../../../lib/platform/use-progress.tsx";
import { t } from "../../../translations/t.ts";
import { deckListStore } from "../../../store/deck-list-store.ts";
import { Screen } from "../../shared/screen.tsx";
import { List } from "../../../ui/list.tsx";
import {
  ActionTileRow,
  type ActionTileRowItem,
} from "../../../ui/action-tile.tsx";
import { userStore } from "../../../store/user-store.ts";
import { assert } from "api";
import { FormattingSwitcher } from "../card-form/formatting-switcher.tsx";
import { WysiwygField } from "../../../ui/wysiwyg-field/wysiwig-field.tsx";
import {
  BotIcon,
  LayersIcon,
  MicIcon,
  PlusIcon,
  ShareIcon,
  TrashIcon,
  UploadIcon,
} from "lucide-react";
import { FilledIcon, TransparentIcon } from "../../../ui/filled-icon.tsx";
import { BackBottomButton } from "../../shared/back-bottom-button.tsx";
import { createMcpSettingsEntryItem } from "../../mcp-settings/mcp-settings-entry.tsx";
import { ChevronIcon } from "../../../ui/chevron-icon.tsx";
import { deleteItemModalStore } from "../../shared/delete-item-modal-store.ts";
import { shareMemoCardUrl } from "../../shared/share-memo-card-url.tsx";

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
  const deckActionItems: ActionTileRowItem[] = [
    ...(deck && deckListStore.isDeckOwner(deck)
      ? [
          {
            type: "action" as const,
            icon: <ShareIcon size={24} />,
            text: t("share"),
            onClick: () => shareMemoCardUrl(deck.shareId),
          },
        ]
      : []),
    {
      type: "action" as const,
      icon: <BotIcon size={24} />,
      text: "ChatGPT",
      onClick: () => {
        screenStore.push(
          userStore.isPaid
            ? { type: "mcpSettings" }
            : { type: "plans", planType: "pro" },
        );
      },
    },
    {
      type: "action" as const,
      icon: <MicIcon size={24} />,
      text: t("speaking_card"),
      onClick: () => deckFormStore.goToSpeakingCards(),
    },
    ...(deck && deckListStore.canRemoveDeck(deck)
      ? [
          {
            type: "action" as const,
            icon: <TrashIcon size={24} />,
            text: t("delete"),
            onClick: () => {
              deleteItemModalStore.open({ type: "deck", deckId: deck.id });
            },
          },
        ]
      : []),
  ];

  return (
    <>
      <Screen
        title={screen.deckId ? t("edit_deck") : t("add_deck")}
        subtitle={
          folderId && folderName ? (
            <div className="text-center text-sm">
              {t("folder")}{" "}
              <ButtonLink
                variant="plain"
                onClick={() => {
                  deckFormStore.executeViaConfirm(() => {
                    screenStore.push({
                      type: "folderPreview",
                      folderId,
                    });
                  });
                }}
              >
                {folderName}
              </ButtonLink>
            </div>
          ) : undefined
        }
      >
        <LabelGroup title={t("title")} isRequired isLabel>
          <Input field={deckFormStore.deckForm.title} />
        </LabelGroup>

        <LabelGroup title={t("description")} slotRight={<FormattingSwitcher />}>
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
        </LabelGroup>

        {!deckFormStore.deckForm?.id && (
          <div className="mt-1">
            <List
              items={[
                createMcpSettingsEntryItem(),
                {
                  icon: (
                    <FilledIcon
                      className="bg-icon-blue"
                      icon={<UploadIcon size={18} />}
                    />
                  ),
                  text: t("anki_import_entry_button"),
                  right: (
                    <ChevronIcon direction="right" className="text-hint" />
                  ),
                  onClick: () => {
                    screenStore.replace({ type: "ankiImport" });
                  },
                },
              ]}
            />
          </div>
        )}

        {deckFormStore.deckForm?.id && (
          <div className="mt-2">
            <List
              items={[
                {
                  icon: (
                    <FilledIcon
                      className="bg-icon-violet"
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
          </div>
        )}

        {deckFormStore.deckForm.id && (
          <ActionTileRow className="mt-2" items={deckActionItems} />
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
