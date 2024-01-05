import { EnvSafe } from "../../env/env-schema.ts";
import { getDatabase } from "../get-database.ts";

export const addDeckToMineDb = async (
  env: EnvSafe,
  body: { user_id: number; deck_id: number },
): Promise<null> => {
  const db = getDatabase(env);

  // Ignore constraint violation
  await db.from("user_deck").insert([body]).single();

  return null;
};
