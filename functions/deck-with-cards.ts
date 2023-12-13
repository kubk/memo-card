import { createJsonResponse } from "./lib/json-response/create-json-response.ts";
import { getUser } from "./services/get-user.ts";
import { createAuthFailedResponse } from "./lib/json-response/create-auth-failed-response.ts";
import { handleError } from "./lib/handle-error/handle-error.ts";
import { envSchema } from "./env/env-schema.ts";
import { getDeckWithCardsById } from "./db/deck/get-deck-with-cards-by-id-db.ts";
import { createBadRequestResponse } from "./lib/json-response/create-bad-request-response.ts";
import { z } from "zod";
import { deckWithCardsSchema } from "./db/deck/decks-with-cards-schema.ts";

export type DeckWithCardsResponse = z.infer<typeof deckWithCardsSchema>;

export const onRequest = handleError(async ({ request, env }) => {
  const user = await getUser(request, env);
  if (!user) return createAuthFailedResponse();
  const envSafe = envSchema.parse(env);

  const url = new URL(request.url);
  const deckId = url.searchParams.get("deck_id");
  if (!deckId) {
    return createBadRequestResponse();
  }

  const deck = await getDeckWithCardsById(envSafe, parseInt(deckId));

  return createJsonResponse<DeckWithCardsResponse>(deck);
});
