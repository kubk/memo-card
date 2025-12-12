import { makeAutoObservable } from "mobx";
import { TextField } from "mobx-form-lite";
import { deckListStore } from "../../store/deck-list-store.ts";
import { removeAllTags } from "../../lib/sanitize-html/remove-all-tags.ts";
import { DeckListItem } from "../../store/deck-list-store.ts";
import { DeckCardDbType } from "api";
import { t } from "../../translations/t.ts";

const MAX_DISPLAY = 20;
const MAX_SEARCH = MAX_DISPLAY + 1;
const MAX_TEXT_LENGTH = 80;
const CONTEXT_LENGTH = 60;

export type SearchResultType = "deck" | "folder" | "card";
export type SearchTab = SearchResultType;

export type SearchMatch = {
  field: string;
  value: string;
  highlightedValue?: string;
};

export type SearchResultItem = {
  id: string;
  type: SearchResultType;
  item: DeckListItem | DeckCardDbType;
  parentItem?: DeckListItem;
  matches: SearchMatch[];
  relevanceScore: number;
};

export class GlobalSearchStore {
  activeTab: SearchTab | null = null;
  searchQuery = new TextField("", {
    afterChange: () => {
      if (this.searchResults.length === 0) {
        this.activeTab = null;
      } else {
        const firstAvailableTab = this.tabs.find((tab) => !tab.disabled);
        this.activeTab = firstAvailableTab ? firstAvailableTab.value : null;
      }
    },
  });

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setActiveTab(tab: SearchTab) {
    const isTabEnabled = !this.tabs.find((t) => t.value === tab)?.disabled;
    if (!isTabEnabled) {
      return;
    }
    this.activeTab = tab;
  }

  get tabs(): {
    value: SearchTab;
    title: string;
    count: string;
    disabled: boolean;
  }[] {
    const { items: cardItems, hasMore: hasMoreCards } = this.cardResults;
    const { items: deckItems, hasMore: hasMoreDecks } = this.deckResults;
    const { items: folderItems, hasMore: hasMoreFolders } = this.folderResults;

    return [
      {
        value: "card",
        title: t("global_search_tabs_cards"),
        count: `${cardItems.length}${hasMoreCards ? "+" : ""}`,
        disabled: cardItems.length === 0,
      },
      {
        value: "deck",
        title: t("global_search_tabs_decks"),
        count: `${deckItems.length}${hasMoreDecks ? "+" : ""}`,
        disabled: deckItems.length === 0,
      },
      {
        value: "folder",
        title: t("global_search_tabs_folders"),
        count: `${folderItems.length}${hasMoreFolders ? "+" : ""}`,
        disabled: folderItems.length === 0,
      },
    ];
  }

  get isSearchActive(): boolean {
    return this.searchQuery.value.trim().length > 0;
  }

  get hasResults(): boolean {
    return this.searchResults.length > 0;
  }

  get searchResults(): SearchResultItem[] {
    const query = this.searchQuery.value.trim().toLowerCase();
    if (!query) {
      return [];
    }

    if (!deckListStore.myInfo) {
      return [];
    }

    const results: SearchResultItem[] = [];
    let deckCount = 0;
    let folderCount = 0;
    let cardCount = 0;

    // Search through ALL folders (flat list)
    for (const folder of deckListStore.myFoldersAsDecks) {
      if (folderCount >= MAX_SEARCH) break;

      if (this.addFolderMatches(results, folder, query)) {
        folderCount++;
      }
    }

    // Search through ALL decks (flat list) - both standalone and those in folders
    for (const deck of deckListStore.myDecks) {
      if (deckCount >= MAX_SEARCH) break;

      if (this.addDeckMatches(results, deck, query)) {
        deckCount++;
      }
    }

    // Search through ALL cards (flat list) from all decks
    if (cardCount < MAX_SEARCH) {
      for (const deck of deckListStore.myDecks) {
        if (cardCount >= MAX_SEARCH) break;

        cardCount += this.addCardMatchesFromDeck(
          results,
          deck,
          query,
          MAX_SEARCH - cardCount,
        );
      }
    }

    // Sort by relevance score (higher is better)
    return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  get deckResults(): { items: SearchResultItem[]; hasMore: boolean } {
    const allDecks = this.searchResults.filter(
      (result) => result.type === "deck",
    );
    return {
      items: allDecks.slice(0, MAX_DISPLAY),
      hasMore: allDecks.length > MAX_DISPLAY,
    };
  }

  get folderResults(): { items: SearchResultItem[]; hasMore: boolean } {
    const allFolders = this.searchResults.filter(
      (result) => result.type === "folder",
    );
    return {
      items: allFolders.slice(0, MAX_DISPLAY),
      hasMore: allFolders.length > MAX_DISPLAY,
    };
  }

  get cardResults(): { items: SearchResultItem[]; hasMore: boolean } {
    const allCards = this.searchResults.filter(
      (result) => result.type === "card",
    );
    return {
      items: allCards.slice(0, MAX_DISPLAY),
      hasMore: allCards.length > MAX_DISPLAY,
    };
  }

  clearSearch() {
    this.searchQuery.onChange("");
  }

  private addFolderMatches(
    results: SearchResultItem[],
    folder: DeckListItem,
    query: string,
  ): boolean {
    const nameMatches = this.getMatches(folder.name, query, "name");
    const descriptionMatches = folder.description
      ? this.getMatches(
          removeAllTags({ text: folder.description, fallback: false }),
          query,
          "description",
        )
      : [];

    const folderMatches = nameMatches.concat(descriptionMatches);

    if (folderMatches.length > 0) {
      results.push({
        id: `folder-${folder.id}`,
        type: "folder",
        item: folder,
        matches: folderMatches,
        relevanceScore: this.calculateRelevanceScore(folderMatches, query),
      });
      return true;
    }
    return false;
  }

  private addDeckMatches(
    results: SearchResultItem[],
    deck: any,
    query: string,
  ): boolean {
    const nameMatches = this.getMatches(deck.name, query, "name");
    const descriptionMatches = deck.description
      ? this.getMatches(
          removeAllTags({ text: deck.description, fallback: false }),
          query,
          "description",
        )
      : [];

    const deckMatches = nameMatches.concat(descriptionMatches);

    if (deckMatches.length > 0) {
      // Find if this deck belongs to a folder
      const folderInfo = this.getDeckFolderInfo(deck.id);

      results.push({
        id: `deck-${deck.id}`,
        type: "deck",
        item: deck,
        parentItem: folderInfo || undefined, // Will be undefined if deck is standalone
        matches: deckMatches,
        relevanceScore: this.calculateRelevanceScore(deckMatches, query),
      });
      return true;
    }
    return false;
  }

  private addCardMatchesFromDeck(
    results: SearchResultItem[],
    deck: any,
    query: string,
    maxCount: number,
  ): number {
    let addedCount = 0;
    for (const card of deck.deckCards) {
      if (addedCount >= maxCount) break;

      const cardMatches = this.searchCard(card, query);
      if (cardMatches.length > 0) {
        results.push({
          id: `card-${card.id}-in-deck-${deck.id}`,
          type: "card",
          item: card,
          parentItem: deck,
          matches: cardMatches,
          relevanceScore: this.calculateRelevanceScore(cardMatches, query),
        });
        addedCount++;
      }
    }
    return addedCount;
  }

  private getDeckFolderInfo(deckId: number): DeckListItem | null {
    if (!deckListStore.myInfo) return null;

    // Check if this deck belongs to any folder
    const folderRelation = deckListStore.myInfo.folders.find(
      (f) => f.deck_id === deckId,
    );
    if (folderRelation) {
      // Find the folder details
      return (
        deckListStore.myFoldersAsDecks.find(
          (folder) => folder.id === folderRelation.folder_id,
        ) || null
      );
    }
    return null;
  }

  private searchCard(card: DeckCardDbType, query: string): SearchMatch[] {
    const matches: SearchMatch[] = [];

    const frontText = removeAllTags({ text: card.front, fallback: false });
    const backText = removeAllTags({ text: card.back, fallback: false });
    const exampleText = card.example
      ? removeAllTags({ text: card.example, fallback: false })
      : null;

    // Check if query matches in any field
    const frontMatches = frontText.toLowerCase().includes(query);
    const backMatches = backText.toLowerCase().includes(query);
    const exampleMatches = exampleText?.toLowerCase().includes(query) || false;

    // Only return results if there's at least one match
    if (!frontMatches && !backMatches && !exampleMatches) {
      return [];
    }

    // Always show Front (with context if long or if it matches)
    const frontDisplayText =
      frontMatches && frontText.length > MAX_TEXT_LENGTH
        ? this.getContextAroundMatch(frontText, query)
        : frontText.length > MAX_TEXT_LENGTH
          ? frontText.substring(0, MAX_TEXT_LENGTH) + "..."
          : frontText;

    matches.push({
      field: "front",
      value: frontDisplayText,
      highlightedValue: frontMatches
        ? this.highlightText(frontDisplayText, query)
        : undefined,
    });

    // Always show Back (with context if long or if it matches)
    const backDisplayText =
      backMatches && backText.length > MAX_TEXT_LENGTH
        ? this.getContextAroundMatch(backText, query)
        : backText.length > MAX_TEXT_LENGTH
          ? backText.substring(0, MAX_TEXT_LENGTH) + "..."
          : backText;

    matches.push({
      field: "back",
      value: backDisplayText,
      highlightedValue: backMatches
        ? this.highlightText(backDisplayText, query)
        : undefined,
    });

    // Only show Example if it has a match
    if (exampleMatches && exampleText) {
      const exampleDisplayText =
        exampleText.length > MAX_TEXT_LENGTH
          ? this.getContextAroundMatch(exampleText, query)
          : exampleText;

      matches.push({
        field: "example",
        value: exampleDisplayText,
        highlightedValue: this.highlightText(exampleDisplayText, query),
      });
    }

    return matches;
  }

  private getMatches(
    text: string,
    query: string,
    field: string,
  ): SearchMatch[] {
    const cleanText = text.toLowerCase();
    const matches: SearchMatch[] = [];

    // Only check for exact substring match to avoid false positives
    const hasExactMatch = cleanText.includes(query);

    if (hasExactMatch) {
      let displayText = text;

      // For long text, show context around the match
      if (text.length > MAX_TEXT_LENGTH) {
        displayText = this.getContextAroundMatch(text, query);
      }
      const highlightedValue = this.highlightText(displayText, query);

      matches.push({
        field,
        value: displayText,
        highlightedValue,
      });
    }

    return matches;
  }

  private getContextAroundMatch(text: string, query: string): string {
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const matchIndex = lowerText.indexOf(lowerQuery);

    if (matchIndex === -1) return text;

    const contextLength = CONTEXT_LENGTH; // Characters to show around the match
    const start = Math.max(0, matchIndex - contextLength);
    const end = Math.min(
      text.length,
      matchIndex + query.length + contextLength,
    );

    let result = text.substring(start, end);

    // Add ellipsis if we truncated
    if (start > 0) result = "..." + result;
    if (end < text.length) result = result + "...";

    return result;
  }

  private highlightText(text: string, query: string): string {
    // Escape special regex characters and create case-insensitive regex
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escapedQuery})`, "gi");
    return text.replace(
      regex,
      '<mark class="bg-button text-white py-0 rounded-sm font-medium">$1</mark>',
    );
  }

  private calculateRelevanceScore(
    matches: SearchMatch[],
    query: string,
  ): number {
    let score = 0;

    for (const match of matches) {
      const lowerValue = match.value.toLowerCase();

      // Only exact matches now (since we removed fuzzy search)
      if (lowerValue.includes(query)) {
        score += 10;

        // Extra bonus for matches at the beginning of text
        if (lowerValue.startsWith(query)) {
          score += 5;
        }
      }

      // Boost score based on field importance
      switch (match.field) {
        case "name":
          score += 5;
          break;
        case "front":
          score += 3;
          break;
        case "back":
          score += 3;
          break;
        case "description":
          score += 2;
          break;
        case "example":
          score += 1;
          break;
      }
    }

    return score;
  }
}

export const globalSearchStore = new GlobalSearchStore();
