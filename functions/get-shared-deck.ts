import { handleError } from "./lib/handle-error/handle-error.ts";
import { createJsonResponse } from "./lib/json-response/create-json-response.ts";
import { createBadRequestResponse } from "./lib/json-response/create-bad-request-response.ts";
import { envSchema } from "./env/env-schema.ts";
import { getDatabase } from "./db/get-database.ts";
import { tables } from "./db/tables.ts";
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
  const user = getUser(request, env);
  if (!user) createAuthFailedResponse();
  const url = new URL(request.url);
  const shareId = url.searchParams.get("share_id");
  if (!shareId) {
    return createBadRequestResponse();
  }

  const envSafe = envSchema.parse(env);
  const db = getDatabase(envSafe);

  const result = await db
    .from(tables.deck)
    .select("*, deck_card!deck_card_deck_id_fkey(*)")
    .eq("share_id", shareId);

  if (result.error) {
    throw new DatabaseException(result.error);
  }

  if (result.data.length === 0) {
    return createNotFoundResponse();
  }

  return createJsonResponse<GetSharedDeckResponse>({
    deck: deckWithCardsSchema.parse(result.data[0]),
  });
});
