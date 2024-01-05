import { DatabaseException } from "../database-exception.ts";
import { getDatabase } from "../get-database.ts";
import { EnvSafe } from "../../env/env-schema.ts";
import { z } from "zod";

const responseSchema = z.array(
  z.object({
    used_by: z.number().nullable(),
    user: z
      .object({
        id: z.number(),
        username: z.string().nullable(),
        first_name: z.string().nullable(),
        last_name: z.string().nullable(),
      })
      .nullable(),
    share_id: z.string(),
    id: z.number(),
    created_at: z.string(),
    duration_days: z.number().nullable(),
  }),
);

export type DeckAccessesForDeckTypeDb = z.infer<typeof responseSchema>;

export const getLastDeckAccessesForDeckDb = async (
  envSafe: EnvSafe,
  deckId: number,
): Promise<DeckAccessesForDeckTypeDb> => {
  const db = getDatabase(envSafe);

  const { data, error } = await db
    .from("deck_access")
    .select(
      "deck_id, author_id, used_by, share_id, id, created_at, duration_days, user:used_by (id, username, first_name, last_name)",
    )
    .eq("deck_id", deckId)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    throw new DatabaseException(error);
  }

  return responseSchema.parse(data);
};
