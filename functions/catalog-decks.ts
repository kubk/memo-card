import { createJsonResponse } from "./lib/json-response/create-json-response.ts";
import { getUser } from "./services/get-user.ts";
import { createAuthFailedResponse } from "./lib/json-response/create-auth-failed-response.ts";
import { handleError } from "./lib/handle-error/handle-error.ts";
import { envSchema } from "./env/env-schema.ts";
import { getCatalogDecksDb } from "./db/deck/get-catalog-decks-db.ts";
import { DeckWithCardsDbType } from "./db/deck/decks-with-cards-schema.ts";

export type DeckCatalogResponse = {
  decks: DeckWithCardsDbType[];
};

export const onRequest = handleError(async ({ request, env }) => {
  const user = await getUser(request, env);
  if (!user) return createAuthFailedResponse();
  const envSafe = envSchema.parse(env);

  const decks = await getCatalogDecksDb(envSafe);

  return createJsonResponse<DeckCatalogResponse>({
    decks,
  });
});
