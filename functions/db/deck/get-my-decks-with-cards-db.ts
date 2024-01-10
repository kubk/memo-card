import { EnvSafe } from "../../env/env-schema.ts";
import { getDatabase } from "../get-database.ts";
import { DatabaseException } from "../database-exception.ts";
import { DeckWithCardsDbType } from "./decks-with-cards-schema.ts";
import { z } from "zod";
import { getManyDecksWithCardsDb } from "./get-many-decks-with-cards-db.ts";

export const getMyDecksWithCardsDb = async (
  env: EnvSafe,
  userId: number,
): Promise<DeckWithCardsDbType[]> => {
  const db = getDatabase(env);

  const getUserDeckIdsResult = await db.rpc("get_user_decks_deck_id", {
    usr_id: userId,
  });

  if (getUserDeckIdsResult.error) {
    throw new DatabaseException(getUserDeckIdsResult.error);
  }

  const deckIds = z
    .array(z.object({ id: z.number() }))
    .transform((list) => list.map((item) => item.id))
    .parse(getUserDeckIdsResult.data);

  return getManyDecksWithCardsDb(env, deckIds);
};
