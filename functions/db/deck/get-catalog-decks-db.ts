import { EnvType } from "../../env/env-schema.ts";
import { getDatabase } from "../get-database.ts";
import { DatabaseException } from "../database-exception.ts";
import {
  decksWithCardsSchema,
  DeckWithCardsDbType,
} from "./decks-with-cards-schema.ts";

export const getCatalogDecksDb = async (
  env: EnvType,
): Promise<DeckWithCardsDbType[]> => {
  const db = getDatabase(env);

  const { data, error } = await db
    .from("deck")
    .select("*")
    .eq("is_public", true)
    .order("id", { ascending: false })
    .limit(100);

  if (error) {
    throw new DatabaseException(error);
  }

  return decksWithCardsSchema.parse(
    data.map((item) => ({ ...item, deck_card: [] })),
  );
};
