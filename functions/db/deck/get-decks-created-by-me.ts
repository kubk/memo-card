import { EnvSafe } from "../../env/env-schema.ts";
import { getDatabase } from "../get-database.ts";
import { DatabaseException } from "../database-exception.ts";
import {
  deckSchema,
  DeckWithoutCardsDbType,
} from "./decks-with-cards-schema.ts";
import { z } from "zod";

export const getDecksCreatedByMe = async (
  env: EnvSafe,
  userId: number,
): Promise<DeckWithoutCardsDbType[]> => {
  const db = getDatabase(env);

  const result = await db.rpc("get_active_decks_by_author", {
    usr_id: userId,
  });

  if (result.error) {
    throw new DatabaseException(result.error);
  }

  return z.array(deckSchema).parse(result.data);
};
