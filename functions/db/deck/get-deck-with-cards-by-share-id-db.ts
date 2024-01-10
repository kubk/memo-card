import { DatabaseException } from "../database-exception.ts";
import {
  DeckWithCardsDbType,
  deckWithCardsSchema,
} from "./decks-with-cards-schema.ts";
import { EnvSafe } from "../../env/env-schema.ts";
import { getDatabase } from "../get-database.ts";

export const getDeckWithCardsByShareIdDb = async (
  env: EnvSafe,
  shareId: string,
): Promise<DeckWithCardsDbType | null> => {
  const db = getDatabase(env);

  const { data, error } = await db
    .from("deck")
    .select("*, deck_card!deck_card_deck_id_fkey(*)")
    .eq("share_id", shareId)
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new DatabaseException(error);
  }

  return data ? deckWithCardsSchema.parse(data) : null;
};
