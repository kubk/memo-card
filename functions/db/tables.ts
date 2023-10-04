export const tables = {
  user: "user",
  deck: "deck",
  userDeck: "user_deck",
  deckCard: "deck_card",
  cardReview: "card_review",
} as const;

export const databaseFunctions = {
  getUserDecks: "get_user_decks_deck_id",
  getCardsToReview: "get_cards_to_review",
} as const;
