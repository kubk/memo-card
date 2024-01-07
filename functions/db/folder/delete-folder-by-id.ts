import { EnvSafe } from "../../env/env-schema.ts";
import { getDatabase } from "../get-database.ts";
import { DatabaseException } from "../database-exception.ts";

export const deleteFolderById = async (
  env: EnvSafe,
  folderId: number,
): Promise<void> => {
  const db = getDatabase(env);
  const deleteFolderResult = await db
    .from("folder")
    .delete()
    .eq("id", folderId)
    .single();

  if (deleteFolderResult.error) {
    throw new DatabaseException(deleteFolderResult.error);
  }
};
