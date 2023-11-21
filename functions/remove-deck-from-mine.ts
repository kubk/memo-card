import { handleError } from "./lib/handle-error/handle-error.ts";
import { getUser } from "./services/get-user.ts";
import { createAuthFailedResponse } from "./lib/json-response/create-auth-failed-response.ts";
import { z } from "zod";
import { envSchema } from "./env/env-schema.ts";
import { createBadRequestResponse } from "./lib/json-response/create-bad-request-response.ts";
import { createJsonResponse } from "./lib/json-response/create-json-response.ts";
import { removeDeckFromMineDb } from "./db/deck/remove-deck-from-mine-db.ts";
import { createForbiddenRequestResponse } from "./lib/json-response/create-forbidden-request-response.ts";
import { isUserDeckExists } from "./db/deck/is-user-deck-exists.ts";

const requestSchema = z.object({
  deckId: z.number(),
});

export type RemoveDeckFromMineRequest = z.infer<typeof requestSchema>;
export type RemoveDeckFromMineResponse = null;

export const onRequestPost = handleError(async ({ env, request }) => {
  const user = await getUser(request, env);
  if (!user) return createAuthFailedResponse();
  const input = requestSchema.safeParse(await request.json());
  if (!input.success) {
    return createBadRequestResponse();
  }

  const envSafe = envSchema.parse(env);

  const userDeckExists = await isUserDeckExists(envSafe, {
    user_id: user.id,
    deck_id: input.data.deckId,
  });
  if (!userDeckExists) {
    return createForbiddenRequestResponse();
  }

  await removeDeckFromMineDb(envSafe, {
    user_id: user.id,
    deck_id: input.data.deckId,
  });

  return createJsonResponse<RemoveDeckFromMineResponse>(null);
});
