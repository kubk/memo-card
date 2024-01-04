import { DatabaseException } from "../database-exception.ts";
import { getDatabase } from "../get-database.ts";
import { EnvSafe } from "../../env/env-schema.ts";

export const getLastDeckAccessesForDeckDb = async (
  envSafe: EnvSafe,
  deckId: number,
) => {
  const db = getDatabase(envSafe);

  const { data, error } = await db
    .from("deck_access")
    .select(
      "deck_id, author_id, used_by, share_id, id, created_at, duration_days",
    )
    .eq("deck_id", deckId)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    throw new DatabaseException(error);
  }

  return data;
};
