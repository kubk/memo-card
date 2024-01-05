import { getDatabase } from "../get-database.ts";
import { EnvSafe } from "../../env/env-schema.ts";
import { DatabaseException } from "../database-exception.ts";

export const startUsingDeckAccessDb = async (
  envSafe: EnvSafe,
  userId: number,
  shareId: string,
) => {
  const db = getDatabase(envSafe);

  const updateResult = await db
    .from("deck_access")
    .update({
      used_by: userId,
      usage_started_at: new Date().toISOString(),
    })
    .eq("share_id", shareId)
    .single();

  if (updateResult.error) {
    throw new DatabaseException(updateResult.error);
  }
};
