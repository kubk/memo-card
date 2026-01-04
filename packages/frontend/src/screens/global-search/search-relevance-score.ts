import { SearchMatch } from "./global-search-store.ts";

export const isWordBoundaryMatch = (text: string, query: string): boolean => {
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const wordBoundaryRegex = new RegExp(
    `(^|\\s|[^a-zA-Z0-9])${escapedQuery}($|\\s|[^a-zA-Z0-9])`,
    "i",
  );
  return wordBoundaryRegex.test(text);
};

export const calculateRelevanceScore = (
  matches: SearchMatch[],
  query: string,
): number => {
  let score = 0;

  for (const match of matches) {
    const lowerValue = match.value.toLowerCase();

    if (!lowerValue.includes(query)) {
      continue;
    }

    // Exact match (query equals entire value) - highest priority
    if (lowerValue === query) {
      score += 100;
    }
    // Word boundary match (query is a complete word, not part of another word)
    else if (isWordBoundaryMatch(lowerValue, query)) {
      score += 50;

      // Extra bonus for matches at the beginning of text
      if (lowerValue.startsWith(query)) {
        score += 10;
      }
    }
    // Substring match (query is part of another word like "rice" in "priced")
    else {
      score += 5;

      if (lowerValue.startsWith(query)) {
        score += 2;
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
};
