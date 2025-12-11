import { BottomSheet } from "../../../ui/bottom-sheet/bottom-sheet.tsx";
import { BottomSheetTitle } from "../../../ui/bottom-sheet/bottom-sheet-title.tsx";
import { List } from "../../../ui/list.tsx";
import { ListHeader } from "../../../ui/list-header.tsx";
import { CircleCheckbox } from "../../../ui/circle-checkbox.tsx";
import { cn } from "../../../ui/cn.ts";
import { platform } from "../../../lib/platform/platform.ts";
import { MoveToDeckSelectorStore } from "./store/move-to-deck-selector-store.ts";
import { Button } from "../../../ui/button.tsx";
import { Flex } from "../../../ui/flex.tsx";
import { t } from "../../../translations/t.ts";
import { LoadingSwap } from "../../../ui/loading-swap.tsx";

export function MoveToDeckSelector({
  store,
}: {
  store: MoveToDeckSelectorStore;
}) {
  const groupedItems = store.availableDecksGrouped;

  // Separate folders and standalone decks
  const folders = groupedItems.filter((item) => item.type === "folder");
  const standaloneDecks = groupedItems.filter((item) => item.type === "deck");

  return (
    <BottomSheet isOpen={store.isOpen} onClose={store.close}>
      <BottomSheetTitle
        title={t("move_card_to_deck_title")}
        onClose={store.close}
      />

      <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto">
        {/* Render folders */}
        {folders.map((listItem) => {
          if (listItem.type !== "folder") return null;

          return (
            <div key={listItem.id} className="flex flex-col gap-2">
              <ListHeader text={listItem.name} />
              <List
                items={listItem.decks.map((deck) => ({
                  onClick: () => {
                    platform.haptic("selection");
                    store.selectDeck(deck.id);
                  },
                  text: (
                    <span
                      className={cn({
                        "font-medium": store.isDeckSelected(deck.id),
                      })}
                    >
                      {deck.name}
                    </span>
                  ),
                  icon: (
                    <CircleCheckbox
                      checkedClassName="bg-button"
                      checked={store.isDeckSelected(deck.id)}
                      onChange={() => {}}
                    />
                  ),
                }))}
              />
            </div>
          );
        })}

        {/* Render standalone decks under "Without folder" */}
        {standaloneDecks.length > 0 && (
          <div className="flex flex-col gap-2">
            <ListHeader text={t("move_card_without_folder")} />
            <List
              items={standaloneDecks.map((item) => ({
                onClick: () => {
                  platform.haptic("selection");
                  store.selectDeck(item.id);
                },
                text: (
                  <span
                    className={cn({
                      "font-medium": store.isDeckSelected(item.id),
                    })}
                  >
                    {item.name}
                  </span>
                ),
                icon: (
                  <CircleCheckbox
                    checkedClassName="bg-button"
                    checked={store.isDeckSelected(item.id)}
                    onChange={() => {}}
                  />
                ),
              }))}
            />
          </div>
        )}
      </div>

      <Flex gap={8} mt={16}>
        <Button outline onClick={store.close}>
          {t("confirm_cancel")}
        </Button>
        <Button disabled={!store.canConfirm} onClick={store.submit}>
          <LoadingSwap isLoading={store.isMoving.value}>
            {t("move_card_move")}
          </LoadingSwap>
        </Button>
      </Flex>
    </BottomSheet>
  );
}
