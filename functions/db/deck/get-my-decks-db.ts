import { EnvType } from "../../env/env-schema.ts";
import { getDatabase } from "../get-database.ts";
import { DatabaseException } from "../database-exception.ts";
import {
  decksWithCardsSchema,
  DeckWithCardsDbType,
} from "./decks-with-cards-schema.ts";
import { z } from "zod";

export const getMyDecksDb = async (
  env: EnvType,
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
    .array(
      z.object({
        id: z.number(),
      }),
    )
    .transform((list) => list.map((item) => item.id))
    .parse(getUserDeckIdsResult.data);

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
