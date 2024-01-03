import { handleError } from "./lib/handle-error/handle-error.ts";
import { createJsonResponse } from "./lib/json-response/create-json-response.ts";
import { createBadRequestResponse } from "./lib/json-response/create-bad-request-response.ts";
import { envSchema } from "./env/env-schema.ts";
import { getDatabase } from "./db/get-database.ts";
import { DatabaseException } from "./db/database-exception.ts";
import { createNotFoundResponse } from "./lib/json-response/create-not-found-response.ts";
import {
  DeckWithCardsDbType,
  deckWithCardsSchema,
} from "./db/deck/decks-with-cards-schema.ts";
import { getUser } from "./services/get-user.ts";
import { createAuthFailedResponse } from "./lib/json-response/create-auth-failed-response.ts";

export type GetSharedDeckResponse = { deck: DeckWithCardsDbType };

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
  const db = getDatabase(envSafe);

  const oneTimeShareLinkResult = await db
    .from("deck_access")
    .select("deck_id, author_id, used_by")
    .eq("share_id", shareId)
    .single();

  if (oneTimeShareLinkResult.error) {
    throw new DatabaseException(oneTimeShareLinkResult.error);
  }

  let deckId: number;
  if (oneTimeShareLinkResult.data) {
    deckId = oneTimeShareLinkResult.data.deck_id;
    if (oneTimeShareLinkResult.data.author_id !== user.id) {
      if (oneTimeShareLinkResult.data.used_by) {
        if (oneTimeShareLinkResult.data.used_by !== user.id) {
          return createBadRequestResponse("The link has already been used");
        }
      } else {
        const updateResult = await db
          .from("deck_access")
          .update({ used_by: user.id })
          .eq("share_id", shareId)
          .single();
        if (updateResult.error) {
          throw new DatabaseException(updateResult.error);
        }
      }
    }

    const stableShareLinkResult = await db
      .from("deck")
      .select("*, deck_card!deck_card_deck_id_fkey(*)")
      .eq("id", deckId)
      .single();

    if (stableShareLinkResult.error) {
      throw new DatabaseException(stableShareLinkResult.error);
    }

    if (!stableShareLinkResult.data) {
      return createNotFoundResponse();
    }

    return createJsonResponse<GetSharedDeckResponse>({
      deck: deckWithCardsSchema.parse(stableShareLinkResult.data),
    });

  } else {
    const stableShareLinkResult = await db
      .from("deck")
      .select("*, deck_card!deck_card_deck_id_fkey(*)")
      .eq("share_id", shareId)
      .single();

    if (stableShareLinkResult.error) {
      throw new DatabaseException(stableShareLinkResult.error);
    }

    if (!stableShareLinkResult.data) {
      return createNotFoundResponse();
    }

    return createJsonResponse<GetSharedDeckResponse>({
      deck: deckWithCardsSchema.parse(stableShareLinkResult.data),
    });
  }
});
