import { EnvType } from "../../env/env-schema.ts";
import { getDatabase } from "../get-database.ts";
import { tables } from "../tables.ts";
import { DatabaseException } from "../database-exception.ts";

export const canEditDeck = async (
  envSafe: EnvType,
  deckId: number,
  userId: number,
) => {
  const db = getDatabase(envSafe);

  const canEditDeckResult = await db
    .from(tables.deck)
    .select()
    .eq("author_id", userId)
    .eq("id", deckId);

  if (canEditDeckResult.error) {
    throw new DatabaseException(canEditDeckResult.error);
  }

  return !!canEditDeckResult.data;
};
