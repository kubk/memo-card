import { globalSearchStore, SearchResultItem } from "./global-search-store.ts";
import { DeckListItem, deckListStore } from "../../store/deck-list-store.ts";
import { screenStore } from "../../store/screen-store.ts";
import { List } from "../../ui/list.tsx";
import { DeckCardDbType } from "api";
import { removeAllTags } from "../../lib/sanitize-html/remove-all-tags.ts";
import { sanitizeTextForCard } from "../../lib/sanitize-html/sanitize-text-for-card.ts";
import { userStore } from "../../store/user-store.ts";
import { ChevronIcon } from "../../ui/chevron-icon.tsx";
import { t } from "../../translations/t.ts";

const getFieldDisplayName = (fieldName: string): string => {
  switch (fieldName) {
    case "front":
      return t("front");
    case "back":
      return t("back");
    case "name":
      return t("title");
    case "description":
      return t("description");
    case "example":
      return t("card_field_example_title");
    default:
      return fieldName;
  }
};

export function SearchResults() {
  if (!globalSearchStore.isSearchActive) {
    return null;
  }

  const deckResults = globalSearchStore.deckResults;
  const folderResults = globalSearchStore.folderResults;
  const cardResults = globalSearchStore.cardResults;

  const hasAnyResults =
    deckResults.items.length > 0 ||
    folderResults.items.length > 0 ||
    cardResults.items.length > 0;

  if (!hasAnyResults) {
    return (
      <div className="text-center text-hint">
        {t("global_search_no_results")}
      </div>
    );
  }

  const handleResultClick = (result: SearchResultItem) => {
    if (result.type === "deck") {
      screenStore.go({
        type: "deckMine",
        deckId: result.item.id,
      });
    } else if (result.type === "folder") {
      screenStore.go({
        type: "folderPreview",
        folderId: result.item.id,
      });
    } else if (result.type === "card" && "deckId" in result.item) {
      const deck = deckListStore.searchDeckById(result.item.deckId);
      if (!deck) {
        return null;
      }

      if (deck.authorId === userStore.myId) {
        screenStore.go({
          type: "deckForm",
          deckId: deck.id,
          index: 1,
          cardId: result.item.id,
        });
      } else {
        screenStore.go({
          type: "cardPreviewId",
          cardId: result.item.id,
          deckId: deck.id,
        });
      }
    }
  };

  const formatMatchValue = (value: string, highlightedValue?: string) => {
    if (highlightedValue) {
      return (
        <span
          dangerouslySetInnerHTML={{
            __html: sanitizeTextForCard(highlightedValue),
          }}
          className="break-words"
        />
      );
    }
    return <span className="break-words">{value}</span>;
  };

  const getResultTitle = (result: SearchResultItem): string => {
    if (result.type === "card") {
      const card = result.item as DeckCardDbType;
      return removeAllTags({ text: card.front, fallback: false });
    } else {
      const item = result.item as DeckListItem;
      return item.name;
    }
  };

  const getResultContext = (result: SearchResultItem) => {
    if (result.parentItem) {
      if (result.type === "card") {
        // For cards: show "Folder: FolderName" if deck is in folder, otherwise "Deck: DeckName"
        return (
          <span className="text-xs text-hint">
            {result.parentItem.type === "folder"
              ? t("global_search_context_folder")
              : t("global_search_context_deck")}
            : {result.parentItem.name}
          </span>
        );
      } else if (result.type === "deck") {
        // For decks: show "Folder: FolderName" if deck is in folder
        return (
          <span className="text-xs text-hint">
            {t("global_search_context_folder")}: {result.parentItem.name}
          </span>
        );
      }
    }
    return null;
  };

  const renderResultList = (results: SearchResultItem[]) => {
    if (results.length === 0) return null;

    return (
      <div className="mb-4 overflow-hidden last:mb-0">
        <List
          items={results.map((result) => ({
            onClick: () => handleResultClick(result),
            text: (
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate whitespace-nowrap">
                  {getResultTitle(result)}
                </div>
                {getResultContext(result)}
                <div className="text-sm text-hint mt-1 space-y-1">
                  {result.matches.map((match, index) => (
                    <div
                      key={index}
                      className="flex flex-wrap items-start gap-1"
                    >
                      <span className="capitalize text-xs bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-700 dark:text-gray-200 shrink-0">
                        {getFieldDisplayName(match.field)}
                      </span>
                      <span className="text-text min-w-0 flex-1">
                        {formatMatchValue(match.value, match.highlightedValue)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ),
            right: <ChevronIcon direction={"right"} className="text-hint" />,
          }))}
        />
      </div>
    );
  };

  return (
    <div>
      {globalSearchStore.activeTab === "card" &&
        renderResultList(cardResults.items)}
      {globalSearchStore.activeTab === "deck" &&
        renderResultList(deckResults.items)}
      {globalSearchStore.activeTab === "folder" &&
        renderResultList(folderResults.items)}
    </div>
  );
}
