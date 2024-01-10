import { EnvSafe } from "../../env/env-schema.ts";
import { shortUniqueId } from "../../lib/short-unique-id/short-unique-id.ts";
import { DatabaseException } from "../database-exception.ts";
import { getDatabase } from "../get-database.ts";
import { DeckAccessType } from "../custom-types.ts";

export const createDeckAccessDb = async (
  envSafe: EnvSafe,
  userId: number,
  body: {
    deckId: number | null;
    folderId: number | null;
    durationDays: number | null;
    type: DeckAccessType;
  },
) => {
  const db = getDatabase(envSafe);

  const createDeckAccessResult = await db
    .from("deck_access")
    .insert({
      deck_id: body.deckId,
      folder_id: body.folderId,
      author_id: userId,
      share_id: shortUniqueId(),
      duration_days: body.durationDays,
      type: body.type,
    })
    .select()
    .single();

  if (createDeckAccessResult.error) {
    throw new DatabaseException(createDeckAccessResult.error);
  }

  return createDeckAccessResult.data;
};
