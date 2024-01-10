import { EnvSafe } from "../../env/env-schema.ts";
import { getDatabase } from "../get-database.ts";
import { DatabaseException } from "../database-exception.ts";
import { z } from "zod";

const userFoldersSchema = z.object({
  folder_id: z.number(),
  folder_title: z.string(),
  folder_description: z.string().nullable(),
  folder_author_id: z.number(),
  folder_share_id: z.string(),
  deck_id: z.number().nullable(),
});

export type UserFoldersDbType = z.infer<typeof userFoldersSchema>;

export const getManyFoldersWithDecksDb = async (
  env: EnvSafe,
  userId: number,
) => {
  const db = getDatabase(env);

  const result = await db.rpc("get_folder_with_decks", {
    usr_id: userId,
  });

  if (result.error) {
    throw new DatabaseException(result.error);
  }

  return z.array(userFoldersSchema).parse(result.data);
};
