import { createJsonResponse } from "./lib/json-response/create-json-response.ts";
import { getUser } from "./services/get-user.ts";
import { createAuthFailedResponse } from "./lib/json-response/create-auth-failed-response.ts";
import { handleError } from "./lib/handle-error/handle-error.ts";
import { envSchema } from "./env/env-schema.ts";
import { createBadRequestResponse } from "./lib/json-response/create-bad-request-response.ts";
import {
  DeckAccessesForDeckTypeDb,
  getLastDeckAccessesForDeckDb,
} from "./db/deck-access/get-last-deck-accesses-for-deck-db.ts";

const getFilters = (urlString: string) => {
  const url = new URL(urlString);
  const deckId = url.searchParams.get("deckId");
  const folderId = url.searchParams.get("folderId");

  if (deckId) {
    return { deckId: parseInt(deckId) };
  }
  if (folderId) {
    return { folderId: parseInt(folderId) };
  }
  return null;
};

export type DeckAccessesResponse = {
  accesses: DeckAccessesForDeckTypeDb;
};

export const onRequest = handleError(async ({ request, env }) => {
  const user = await getUser(request, env);
  if (!user) return createAuthFailedResponse();

  const filters = getFilters(request.url);
  if (!filters) return createBadRequestResponse();

  const envSafe = envSchema.parse(env);
  const data = await getLastDeckAccessesForDeckDb(envSafe, filters);

  return createJsonResponse<DeckAccessesResponse>({
    accesses: data,
  });
});
