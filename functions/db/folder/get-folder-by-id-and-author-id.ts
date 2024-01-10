import { EnvSafe } from "../../env/env-schema.ts";
import { getDatabase } from "../get-database.ts";
import { DatabaseException } from "../database-exception.ts";

export const getFolderByIdAndAuthorId = async (
  envSafe: EnvSafe,
  folderId: number,
  user: { id: number; is_admin: boolean },
) => {
  const db = getDatabase(envSafe);

  let query = db.from("folder").select().eq("id", folderId);
  if (!user.is_admin) {
    query = query.eq("author_id", user.id);
  }

  const canEditResult = await query.maybeSingle();
  if (canEditResult.error) {
    throw new DatabaseException(canEditResult.error);
  }

  return canEditResult.data ?? null;
};
