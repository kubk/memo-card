import { EnvSafe } from "../../env/env-schema.ts";
import { getDatabase } from "../get-database.ts";
import { DatabaseException } from "../database-exception.ts";

export const getDeckByIdAndAuthorId = async (
  envSafe: EnvSafe,
  deckId: number,
  userId: number,
  isAdmin: boolean,
) => {
  const db = getDatabase(envSafe);

  let query = db.from("deck").select().eq("id", deckId);

  if (!isAdmin) {
    query = query.eq("author_id", userId);
  }

  const canEditDeckResult = await query.single();

  if (canEditDeckResult.error) {
    throw new DatabaseException(canEditDeckResult.error);
  }

  return canEditDeckResult.data ?? null;
};
