import { EnvSafe } from "../../env/env-schema.ts";
import { getDatabase } from "../get-database.ts";
import { DatabaseException } from "../database-exception.ts";
import { z } from "zod";

const cardToReviewSchema = z.object({
  id: z.number(),
  deck_id: z.number(),
  type: z.enum(["new", "repeat"]),
});

const schema = z.array(cardToReviewSchema);

export type CardToReviewDbType = z.infer<typeof cardToReviewSchema>;

export const getCardsToReviewDb = async (
  env: EnvSafe,
  userId: number,
): Promise<CardToReviewDbType[]> => {
  const db = getDatabase(env);

  const result = await db.rpc("get_cards_to_review", {
    usr_id: userId,
  });

  if (result.error) {
    throw new DatabaseException(result.error);
  }

  return schema.parse(result.data);
};
