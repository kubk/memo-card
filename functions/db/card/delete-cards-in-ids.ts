import { EnvSafe } from "../../env/env-schema.ts";
import { getDatabase } from "../get-database.ts";
import { DatabaseException } from "../database-exception.ts";

export const deleteCardsInIds = async (
  env: EnvSafe,
  cardsToRemoveIds: number[],
) => {
  const db = getDatabase(env);

  const deleteCardsResult = await db
    .from("deck_card")
    .delete()
    .in("id", cardsToRemoveIds);

  if (deleteCardsResult.error) {
    throw new DatabaseException(deleteCardsResult.error);
  }
};
