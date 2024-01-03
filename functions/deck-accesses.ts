import { createJsonResponse } from "./lib/json-response/create-json-response.ts";
import { getUser } from "./services/get-user.ts";
import { createAuthFailedResponse } from "./lib/json-response/create-auth-failed-response.ts";
import { handleError } from "./lib/handle-error/handle-error.ts";
import { envSchema } from "./env/env-schema.ts";
import { getDatabase } from "./db/get-database.ts";
import { DatabaseException } from "./db/database-exception.ts";
import { createBadRequestResponse } from "./lib/json-response/create-bad-request-response.ts";

export type DeckAccessesOfDeckResponse = {
  accesses: Array<{
    used_by: number | null;
    share_id: string;
  }>;
};

export const onRequest = handleError(async ({ request, env }) => {
  const user = await getUser(request, env);
  if (!user) return createAuthFailedResponse();

  const url = new URL(request.url);
  const deckId = url.searchParams.get("deck_id");
  if (!deckId) {
    return createBadRequestResponse();
  }

  const envSafe = envSchema.parse(env);
  const db = getDatabase(envSafe);

  const { data, error } = await db
    .from("deck_access")
    .select("deck_id, author_id, used_by, share_id")
    .eq("deck_id", deckId)
    .limit(100);

  if (error) {
    throw new DatabaseException(error);
  }

  return createJsonResponse<DeckAccessesOfDeckResponse>({
    accesses: data,
  });
});
