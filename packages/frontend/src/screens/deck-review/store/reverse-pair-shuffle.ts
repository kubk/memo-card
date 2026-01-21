import { CardUnderReviewStore } from "./card-under-review-store.ts";

type CardList = CardUnderReviewStore[];

type Range = {
  startIndex?: number;
  endIndex?: number;
};

const isReversePair = (
  first: CardUnderReviewStore,
  second: CardUnderReviewStore,
) => first.front === second.back && first.back === second.front;

const canSwapCards = (cards: CardList, i: number, j: number) => {
  const prev = cards[i - 1];
  const next = cards[i + 1];
  const candidate = cards[j];
  const moving = cards[i];
  const beforeJ = cards[j - 1];
  const afterJ = cards[j + 1];

  if (prev && isReversePair(prev, candidate)) {
    return false;
  }
  if (next && isReversePair(candidate, next)) {
    return false;
  }
  if (beforeJ && isReversePair(beforeJ, moving)) {
    return false;
  }
  if (afterJ && isReversePair(moving, afterJ)) {
    return false;
  }

  return true;
};

export const separateReversePairs = (cards: CardList, range?: Range) => {
  const startIndex = range?.startIndex ?? 0;
  const endIndex = range?.endIndex ?? cards.length - 1;

  if (endIndex - startIndex < 1) {
    return;
  }

  for (let i = startIndex + 1; i <= endIndex; i += 1) {
    if (!isReversePair(cards[i - 1], cards[i])) {
      continue;
    }

    let swapIndex = -1;
    for (let j = i + 1; j <= endIndex; j += 1) {
      if (canSwapCards(cards, i, j)) {
        swapIndex = j;
        break;
      }
    }

    if (swapIndex !== -1) {
      [cards[i], cards[swapIndex]] = [cards[swapIndex], cards[i]];
    }
  }
};
