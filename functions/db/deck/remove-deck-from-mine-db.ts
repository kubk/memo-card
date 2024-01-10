import { EnvSafe } from "../../env/env-schema.ts";
import { getDatabase } from "../get-database.ts";
import { DatabaseException } from "../database-exception.ts";
import { getDeckByIdAndAuthorId } from "./get-deck-by-id-and-author-id.ts";

export const removeDeckFromMineDb = async (
  env: EnvSafe,
  body: { user_id: number; deck_id: number },
): Promise<null> => {
  const db = getDatabase(env);

  const deleteFromUserDeckResult = await db
    .from("user_deck")
    .delete()
    .match(body);
  if (deleteFromUserDeckResult.error) {
    throw new DatabaseException(deleteFromUserDeckResult.error);
  }

  const userDeckResult = await getDeckByIdAndAuthorId(env, body.deck_id, {
    id: body.user_id,
    is_admin: false,
  });
  if (userDeckResult) {
    const deleteFromDeckFolderResult = await db
      .from("deck_folder")
      .delete()
      .match({
        deck_id: body.deck_id,
      });
    if (deleteFromDeckFolderResult.error) {
      throw new DatabaseException(deleteFromDeckFolderResult.error);
    }
  }

  return null;
};
