import { EnvSafe } from "../../env/env-schema.ts";
import { getDatabase } from "../get-database.ts";
import { DatabaseException } from "../database-exception.ts";
import { decksWithCardsSchema } from "./decks-with-cards-schema.ts";

export const getUnAddedPublicDecksDb = async (env: EnvSafe, userId: number) => {
  const db = getDatabase(env);

  const { data, error } = await db.rpc("get_unadded_public_decks", {
    user_id: userId,
  });

  if (error) {
    throw new DatabaseException(error);
  }

  return decksWithCardsSchema.parse(
    data.map((item) => ({ ...item, deck_card: [] })),
  );
};
