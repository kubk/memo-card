import { DatabaseException } from "../database-exception.ts";
import {
  DeckWithCardsDbType,
  deckWithCardsSchema,
} from "./decks-with-cards-schema.ts";
import { EnvSafe } from "../../env/env-schema.ts";
import { getDatabase } from "../get-database.ts";

export const getDeckWithCardsById = async (
  env: EnvSafe,
  deckId: number,
): Promise<DeckWithCardsDbType> => {
  const db = getDatabase(env);

  const stableShareLinkResult = await db
    .from("deck")
    .select("*, deck_card!deck_card_deck_id_fkey(*)")
    .eq("id", deckId)
    .limit(1)
    .single();

  if (stableShareLinkResult.error) {
    throw new DatabaseException(stableShareLinkResult.error);
  }

  return deckWithCardsSchema.parse(stableShareLinkResult.data);
};
