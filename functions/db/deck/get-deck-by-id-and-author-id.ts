import { EnvSafe } from "../../env/env-schema.ts";
import { getDatabase } from "../get-database.ts";
import { DatabaseException } from "../database-exception.ts";

export const getDeckByIdAndAuthorId = async (
  envSafe: EnvSafe,
  deckId: number,
  user: { id: number; is_admin: boolean },
) => {
  const db = getDatabase(envSafe);

  let query = db.from("deck").select().eq("id", deckId);
  if (!user.is_admin) {
    query = query.eq("author_id", user.id);
  }

  const canEditDeckResult = await query.maybeSingle();
  if (canEditDeckResult.error) {
    throw new DatabaseException(canEditDeckResult.error);
  }

  return canEditDeckResult.data ?? null;
};
