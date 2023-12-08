import { DatabaseException } from "../database-exception.ts";
import { deckWithCardsSchema } from "./decks-with-cards-schema.ts";
import { EnvType } from "../../env/env-schema.ts";
import { getDatabase } from "../get-database.ts";

export const getDeckWithCardsById = async (env: EnvType, deckId: number) => {
  const db = getDatabase(env);

  const { data, error } = await db
    .from("deck")
    .select("*, deck_card!deck_card_deck_id_fkey(*)")
    .eq("id", deckId)
    .limit(1)
    .single();

  if (error) {
    throw new DatabaseException(error);
  }

  return deckWithCardsSchema.parse(data);
};
