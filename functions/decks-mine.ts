import { handleError } from "./lib/handle-error/handle-error.ts";
import { getUser } from "./services/get-user.ts";
import { createAuthFailedResponse } from "./lib/json-response/create-auth-failed-response.ts";
import { envSchema } from "./env/env-schema.ts";
import { getDecksCreatedByMe } from "./db/deck/get-decks-created-by-me.ts";
import { DeckWithoutCardsDbType } from "./db/deck/decks-with-cards-schema.ts";
import { createJsonResponse } from "./lib/json-response/create-json-response.ts";

export type DecksMineResponse = {
  decks: DeckWithoutCardsDbType[];
};

export const onRequest = handleError(async ({ request, env }) => {
  const user = await getUser(request, env);
  if (!user) return createAuthFailedResponse();
  const envSafe = envSchema.parse(env);

  const decks = await getDecksCreatedByMe(envSafe, user.id);

  return createJsonResponse<DecksMineResponse>({ decks: decks });
});
