import { Screen } from "../shared/screen.tsx";
import { Label } from "../../ui/label.tsx";
import { t } from "../../translations/t.ts";
import { Input } from "../../ui/input.tsx";
import { useBackButton } from "../../lib/platform/use-back-button.ts";
import { screenStore } from "../../store/screen-store.ts";
import { useProgress } from "../../lib/platform/use-progress.tsx";
import { useMount } from "../../lib/react/use-mount.ts";
import { useMainButton } from "../../lib/platform/use-main-button.ts";
import { Loader } from "../../ui/loader.tsx";
import { useFolderFormStore } from "./store/folder-form-store-context.tsx";
import { EmptyState } from "../../ui/empty-state.tsx";
import { List } from "../../ui/list.tsx";
import { ValidationError } from "../../ui/validation-error.tsx";
import { userStore } from "../../store/user-store.ts";
import { assert } from "api";
import { Flex } from "../../ui/flex.tsx";
import { FormattingSwitcher } from "../deck-form/card-form/formatting-switcher.tsx";
import { WysiwygField } from "../../ui/wysiwyg-field/wysiwig-field.tsx";
import { cn } from "../../ui/cn.ts";
import { deckListStore } from "../../store/deck-list-store.ts";
import { PlusIcon, TrashIcon } from "lucide-react";
import { wysiwygStore } from "../../store/wysiwyg-store.ts";
import { FolderActions } from "../shared/folder-actions.tsx";

export function FolderForm() {
  const folderStore = useFolderFormStore();
  const { folderForm } = folderStore;
  const screen = screenStore.screen;
  assert(screen.type === "folderForm");

  useMount(() => {
    folderStore.loadForm();
  });

  useMainButton(
    t("save"),
    () => {
      folderStore.onFolderSave();
    },
    () => wysiwygStore.bottomSheet === null,
  );

  useBackButton(() => {
    folderStore.onBack();
  });

  useProgress(() => folderStore.folderUpsertMutation.isPending);

  if (!folderForm) {
    return null;
  }

  const folder = screen.folderId
    ? deckListStore.searchFolderById(screen.folderId)
    : null;

  return (
    <Screen title={screen.folderId ? t("edit_folder") : t("add_folder")}>
      <Label text={t("title")} isRequired>
        <Input field={folderForm.title} />
      </Label>

      <Label isPlain text={t("description")} slotRight={<FormattingSwitcher />}>
        {userStore.isCardFormattingOn.value ? (
          <WysiwygField field={folderForm.description} allowImage={false} />
        ) : (
          <Input field={folderForm.description} type={"textarea"} rows={3} />
        )}
      </Label>

      {folder && (
        <div className="mt-0.5 mb-2.5">
          <FolderActions
            folder={{
              id: folder.folder_id,
              authorId: folder.folder_author_id,
              shareId: folder.folder_share_id,
            }}
            variant="buttons"
          />
        </div>
      )}

      <Label text={t("decks")} isPlain>
        {folderForm.decks.value.length === 0 && (
          <div className="mb-2.5">
            <EmptyState>{t("folder_form_no_decks")}</EmptyState>
          </div>
        )}
        {folderForm.decks.isTouched && folderForm.decks.error && (
          <ValidationError error={folderForm.decks.error} />
        )}
        <List
          items={folderForm.decks.value.map((deck, i) => {
            return {
              text: deck.name,
              onClick: () => {
                folderStore.onSelectDeck(deck.id);
              },
              right: (
                <button
                  className="pt-1 text-base"
                  onClick={(e) => {
                    e.stopPropagation();
                    assert(folderForm);
                    return folderForm.decks.removeByIndex(i);
                  }}
                >
                  <TrashIcon className="text-danger" size={24} />
                </button>
              ),
            };
          })}
        />
      </Label>

      <Label text={t("add_deck_to_folder")} isPlain>
        {folderStore.decksMineQuery.isPending && <Loader />}
        {folderStore.decksMineQuery.data !== undefined &&
        folderStore.decksAvailableFiltered.length === 0 ? (
          <EmptyState>{t("no_decks_to_add")}</EmptyState>
        ) : null}

        <List
          items={folderStore.decksAvailableFiltered.map((deck) => {
            return {
              text: deck.name,
              right: (
                <button
                  className="pt-1 text-base"
                  onClick={() => {
                    assert(folderForm);
                    folderForm.decks.push({
                      id: deck.id,
                      name: deck.name,
                    });
                  }}
                >
                  <PlusIcon size={24} className="text-button" />
                </button>
              ),
            };
          })}
        />
      </Label>

      {folderStore.decksNotAvailable.length > 0 && (
        <Label text={t("decks_in_other_folders")} isPlain>
          <List
            items={folderStore.decksNotAvailable.map((deck) => {
              return {
                text: (
                  <Flex
                    className={cn(userStore.isRtl && "text-right")}
                    direction={"column"}
                    gap={4}
                  >
                    <div>{deck.name}</div>
                    <div className="text-sm text-hint">{deck.folderTitle}</div>
                  </Flex>
                ),
              };
            })}
          />
        </Label>
      )}
    </Screen>
  );
}
