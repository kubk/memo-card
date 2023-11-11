import { EnvType } from "../../env/env-schema.ts";
import { getDatabase } from "../get-database.ts";
import { DatabaseException } from "../database-exception.ts";

export const addDeckToMineDb = async (
  env: EnvType,
  body: { user_id: number; deck_id: number },
): Promise<null> => {
  const db = getDatabase(env);

  const { error } = await db.from("user_deck").insert([body]).single();

  if (error) {
    throw new DatabaseException(error);
  }

  return null;
};
