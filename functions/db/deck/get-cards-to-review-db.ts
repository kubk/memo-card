import { EnvType } from "../../env/env-schema.ts";
import { getDatabase } from "../get-database.ts";
import { databaseFunctions } from "../tables.ts";
import { DatabaseException } from "../database-exception.ts";
import { z } from "zod";

const cardToReviewSchema = z.object({
  id: z.number(),
  deck_id: z.number(),
});

const schema = z.array(cardToReviewSchema);

export type CardToReviewDbType = z.infer<typeof cardToReviewSchema>;

export const getCardsToReviewDb = async (
  env: EnvType,
  userId: number,
): Promise<CardToReviewDbType[]> => {
  const db = getDatabase(env);

  const result = await db.rpc(databaseFunctions.getCardsToReview, {
    usr_id: userId,
  });

  if (result.error) {
    throw new DatabaseException(result.error);
  }

  return schema.parse(result.data);
};
