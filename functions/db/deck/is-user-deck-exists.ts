import { EnvSafe } from "../../env/env-schema.ts";
import { getDatabase } from "../get-database.ts";
import { DatabaseException } from "../database-exception.ts";

export const isUserDeckExists = async (
  envSafe: EnvSafe,
  body: { user_id: number; deck_id: number },
) => {
  const db = getDatabase(envSafe);

  const userDeck = await db.from("user_deck").select().match(body);

  if (userDeck.error) {
    throw new DatabaseException(userDeck.error);
  }

  return userDeck.data.length ? userDeck.data[0] : null;
};
