import { DatabaseException } from "../database-exception.ts";
import { deckWithCardsSchema } from "./decks-with-cards-schema.ts";
import { EnvSafe } from "../../env/env-schema.ts";
import { getDatabase } from "../get-database.ts";

export const getDeckWithCardsByShareIdDb = async (
  env: EnvSafe,
  shareId: string,
) => {
  const db = getDatabase(env);

  const { data, error } = await db
    .from("deck")
    .select("*, deck_card!deck_card_deck_id_fkey(*)")
    .eq("share_id", shareId)
    .limit(1)
    .single();

  if (error) {
    throw new DatabaseException(error);
  }

  return deckWithCardsSchema.parse(data);
};
