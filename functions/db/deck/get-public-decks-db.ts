import { EnvType } from "../../env/env-schema.ts";
import { getDatabase } from "../get-database.ts";
import { DatabaseException } from "../database-exception.ts";
import {
  decksWithCardsSchema,
  DeckWithCardsDbType,
} from "./decks-with-cards-schema.ts";

export const getPublicDecksDb = async (
  env: EnvType,
): Promise<DeckWithCardsDbType[]> => {
  const db = getDatabase(env);

  const { data, error } = await db
    .from("deck")
    .select("*,deck_card!deck_card_deck_id_fkey(*)")
    .eq("is_public", true)
    .order("id", { ascending: false })
    .limit(20);

  if (error) {
    throw new DatabaseException(error);
  }

  return decksWithCardsSchema.parse(data);
};
