import { EnvSafe } from "../../env/env-schema.ts";
import { getDatabase } from "../get-database.ts";
import { DatabaseException } from "../database-exception.ts";
import { getFolderWithDeckIds } from "./get-folder-with-deck-ids.ts";

export const addFolderToMine = async (
  env: EnvSafe,
  body: { user_id: number; folder_id: number },
) => {
  const folderWithDeckIdsResult = await getFolderWithDeckIds(env, {
    id: body.folder_id,
  });

  const db = getDatabase(env);
  const connectUserToFolder = await db
    .from("user_folder")
    .insert(body)
    .single();

  if (connectUserToFolder.error) {
    throw new DatabaseException(connectUserToFolder.error);
  }

  const connectDecksToUser = await db
    .from("user_deck")
    .upsert(
      folderWithDeckIdsResult.decks.map((deck) => ({
        user_id: body.user_id,
        deck_id: deck.id,
      })),
    )
    .select();

  if (connectDecksToUser.error) {
    throw new DatabaseException(connectDecksToUser.error);
  }
};
