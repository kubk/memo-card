import { handleError } from "./lib/handle-error/handle-error.ts";
import { createJsonResponse } from "./lib/json-response/create-json-response.ts";
import { createBadRequestResponse } from "./lib/json-response/create-bad-request-response.ts";
import { envSchema } from "./env/env-schema.ts";
import {
  DeckWithCardsDbType,
  deckWithCardsSchema,
} from "./db/deck/decks-with-cards-schema.ts";
import { getUser } from "./services/get-user.ts";
import { createAuthFailedResponse } from "./lib/json-response/create-auth-failed-response.ts";
import { getDeckAccessByShareIdDb } from "./db/deck-access/get-deck-access-by-share-id-db.ts";
import { startUsingDeckAccessDb } from "./db/deck-access/start-using-deck-access-db.ts";
import { getDeckWithCardsById } from "./db/deck/get-deck-with-cards-by-id-db.ts";
import { getDeckWithCardsByShareIdDb } from "./db/deck/get-deck-with-cards-by-share-id-db.ts";
import { addDeckToMineDb } from "./db/deck/add-deck-to-mine-db.ts";
import { assert } from "./lib/typescript/assert.ts";
import { addFolderToMine } from "./db/folder/add-folder-to-mine-db.tsx";
import {
  FolderWithDecksWithCards,
  getFolderWithDecksWithCardsDb,
} from "./db/folder/get-folder-with-decks-with-cards-db.ts";

export type GetSharedDeckResponse =
  | { deck: DeckWithCardsDbType }
  | { folder: FolderWithDecksWithCards };

export const onRequest = handleError(async ({ env, request }) => {
  const user = await getUser(request, env);
  if (!user) {
    return createAuthFailedResponse();
  }
  const url = new URL(request.url);
  const shareId = url.searchParams.get("share_id");
  if (!shareId) {
    return createBadRequestResponse();
  }

  const envSafe = envSchema.parse(env);

  const deckAccessResult = await getDeckAccessByShareIdDb(envSafe, shareId);

  if (deckAccessResult) {
    if (deckAccessResult.processed_at) {
      return createBadRequestResponse("The link has expired");
    }

    if (deckAccessResult.author_id !== user.id) {
      if (deckAccessResult.used_by) {
        if (deckAccessResult.used_by !== user.id) {
          return createBadRequestResponse("The link has already been used");
        }
      } else {
        await startUsingDeckAccessDb(envSafe, user.id, shareId);

        if (deckAccessResult.type === "deck") {
          assert(
            deckAccessResult.deck_id,
            "deck_id is null when the type is deck",
          );
          await addDeckToMineDb(envSafe, {
            user_id: user.id,
            deck_id: deckAccessResult.deck_id,
          });
        }
        if (deckAccessResult.type === "folder") {
          assert(
            deckAccessResult.folder_id,
            "folder_id is null when the type is folder",
          );
          await addFolderToMine(envSafe, {
            user_id: user.id,
            folder_id: deckAccessResult.folder_id,
          });
        }
      }
    }

    if (deckAccessResult.type === "deck") {
      const deckId = deckAccessResult.deck_id;
      assert(deckId, "deck_id is null when the type is deck");
      const deck = await getDeckWithCardsById(envSafe, deckId);

      return createJsonResponse<GetSharedDeckResponse>({
        deck: deckWithCardsSchema.parse(deck),
      });
    }
    if (deckAccessResult.type === "folder") {
      const folderId = deckAccessResult.folder_id;
      assert(folderId, "folder_id is null when the type is folder");
      const folder = await getFolderWithDecksWithCardsDb(envSafe, {
        id: folderId,
      });

      return createJsonResponse<GetSharedDeckResponse>({
        folder,
      });
    }
    assert(false, `Unknown deck access type: ${deckAccessResult.type}`);
  } else {
    const deckStableShareLinkResult = await getDeckWithCardsByShareIdDb(
      envSafe,
      shareId,
    );

    if (deckStableShareLinkResult) {
      return createJsonResponse<GetSharedDeckResponse>({
        deck: deckWithCardsSchema.parse(deckStableShareLinkResult),
      });
    }

    const folder = await getFolderWithDecksWithCardsDb(envSafe, {
      share_id: shareId,
    });
    return createJsonResponse<GetSharedDeckResponse>({
      folder,
    });
  }
});
