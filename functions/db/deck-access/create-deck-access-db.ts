import { EnvSafe } from "../../env/env-schema.ts";
import { shortUniqueId } from "../../lib/short-unique-id/short-unique-id.ts";
import { DatabaseException } from "../database-exception.ts";
import { getDatabase } from "../get-database.ts";

export const createDeckAccessDb = async (
  envSafe: EnvSafe,
  userId: number,
  deckId: number,
  durationDays: number | null,
) => {
  const db = getDatabase(envSafe);

  const createDeckAccessResult = await db
    .from("deck_access")
    .insert({
      deck_id: deckId,
      author_id: userId,
      share_id: shortUniqueId(),
      duration_days: durationDays,
    })
    .select()
    .single();

  if (createDeckAccessResult.error) {
    throw new DatabaseException(createDeckAccessResult.error);
  }

  return createDeckAccessResult.data;
};
