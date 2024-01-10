import { getManyDecksWithCardsDb } from "../deck/get-many-decks-with-cards-db.ts";
import { EnvSafe } from "../../env/env-schema.ts";
import {
  FolderWithDeckIdsDbType,
  getFolderWithDeckIds,
} from "./get-folder-with-deck-ids.ts";
import { DeckWithCardsDbType } from "../deck/decks-with-cards-schema.ts";

export type FolderWithDecksWithCards = Omit<
  FolderWithDeckIdsDbType,
  "decks"
> & {
  decks: DeckWithCardsDbType[];
};

export const getFolderWithDecksWithCardsDb = async (
  envSafe: EnvSafe,
  folderMatch: { id: number } | { share_id: string },
): Promise<FolderWithDecksWithCards> => {
  const folderWithDeckIdsResult = await getFolderWithDeckIds(
    envSafe,
    folderMatch,
  );

  return {
    ...folderWithDeckIdsResult,
    decks: await getManyDecksWithCardsDb(
      envSafe,
      folderWithDeckIdsResult.decks.map((deck) => deck.id),
    ),
  };
};
