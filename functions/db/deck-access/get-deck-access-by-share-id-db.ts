import { DatabaseException } from "../database-exception.ts";
import { getDatabase } from "../get-database.ts";
import { EnvSafe } from "../../env/env-schema.ts";
import { z } from "zod";

const resultSchema = z.object({
  deck_id: z.number().nullable(),
  folder_id: z.number().nullable(),
  author_id: z.number(),
  used_by: z.number().nullable(),
  processed_at: z.string().nullable(),
  type: z.enum(["folder", "deck"]),
});

type GetDeckAccessByShareIdDbResultType = z.infer<typeof resultSchema>;

export const getDeckAccessByShareIdDb = async (
  envSafe: EnvSafe,
  shareId: string,
): Promise<GetDeckAccessByShareIdDbResultType | null> => {
  const db = getDatabase(envSafe);

  const oneTimeShareLinkResult = await db
    .from("deck_access")
    .select("deck_id, author_id, used_by, processed_at, folder_id, type")
    .eq("share_id", shareId)
    .maybeSingle();

  if (oneTimeShareLinkResult.error) {
    throw new DatabaseException(oneTimeShareLinkResult.error);
  }

  return oneTimeShareLinkResult.data
    ? resultSchema.parse(oneTimeShareLinkResult.data)
    : null;
};
