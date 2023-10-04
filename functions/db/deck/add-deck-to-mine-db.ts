import { EnvType } from "../../env/env-schema.ts";
import { getDatabase } from "../get-database.ts";
import { tables } from "../tables.ts";
import { DatabaseException } from "../database-exception.ts";

export const addDeckToMineDb = async (
  env: EnvType,
  body: { user_id: number; deck_id: number },
): Promise<null> => {
  const db = getDatabase(env);

  const { error } = await db.from(tables.userDeck).insert([body]).single();

  if (error) {
    throw new DatabaseException(error);
  }

  return null;
};
