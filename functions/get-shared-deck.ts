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

export type GetSharedDeckResponse = {
  deck: DeckWithCardsDbType;
};

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

  const oneTimeShareLinkResultData = await getDeckAccessByShareIdDb(
    envSafe,
    shareId,
  );

  if (oneTimeShareLinkResultData) {
    if (oneTimeShareLinkResultData.author_id !== user.id) {
      if (oneTimeShareLinkResultData.used_by) {
        if (oneTimeShareLinkResultData.used_by !== user.id) {
          return createBadRequestResponse("The link has already been used");
        }
      } else {
        await startUsingDeckAccessDb(envSafe, user.id, shareId);
      }
    }

    const deckId = oneTimeShareLinkResultData.deck_id;
    const stableShareLinkResult = await getDeckWithCardsById(envSafe, deckId);

    return createJsonResponse<GetSharedDeckResponse>({
      deck: deckWithCardsSchema.parse(stableShareLinkResult),
    });
  } else {
    const stableShareLinkResult = await getDeckWithCardsByShareIdDb(
      envSafe,
      shareId,
    );

    return createJsonResponse<GetSharedDeckResponse>({
      deck: deckWithCardsSchema.parse(stableShareLinkResult),
    });
  }
});
