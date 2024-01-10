import { EnvSafe } from "../../env/env-schema.ts";
import { DatabaseException } from "../database-exception.ts";
import { getDatabase } from "../get-database.ts";
import { z } from "zod";

const folderSchema = z.object({
  id: z.number(),
  title: z.string(),
  author_id: z.number(),
  description: z.string().nullable(),
  share_id: z.string(),
  decks: z.array(
    z.object({
      id: z.number(),
    }),
  ),
});

export type FolderWithDeckIdsDbType = z.infer<typeof folderSchema>;

export const getFolderWithDeckIds = async (
  env: EnvSafe,
  match: { id: number } | { share_id: string },
): Promise<FolderWithDeckIdsDbType> => {
  const db = getDatabase(env);
  const folderWithDecksResult = await db
    .from("folder")
    .select("*, decks:deck(id)")
    .match(match)
    .single();

  if (folderWithDecksResult.error) {
    throw new DatabaseException(folderWithDecksResult.error);
  }

  return folderSchema.parse(folderWithDecksResult.data);
};
