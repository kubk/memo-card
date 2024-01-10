import { DatabaseException } from "../database-exception.ts";
import {
  decksWithCardsSchema,
  DeckWithCardsDbType,
} from "./decks-with-cards-schema.ts";
import { getDatabase } from "../get-database.ts";
import { EnvSafe } from "../../env/env-schema.ts";

export const getManyDecksWithCardsDb = async (
  env: EnvSafe,
  deckIds: number[],
): Promise<DeckWithCardsDbType[]> => {
  const db = getDatabase(env);

  const { data, error } = await db
    .from("deck")
    .select("*, deck_card!deck_card_deck_id_fkey(*)")
    .in("id", deckIds)
    .order("id", { ascending: false });

  if (error) {
    throw new DatabaseException(error);
  }

  return decksWithCardsSchema.parse(data);
};
