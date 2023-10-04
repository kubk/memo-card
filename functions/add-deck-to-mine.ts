import { handleError } from "./lib/handle-error/handle-error.ts";
import { getUser } from "./services/get-user.ts";
import { createAuthFailedResponse } from "./lib/json-response/create-auth-failed-response.ts";
import { z } from "zod";
import { addDeckToMineDb } from "./db/deck/add-deck-to-mine-db.ts";
import { envSchema } from "./env/env-schema.ts";
import { createBadRequestResponse } from "./lib/json-response/create-bad-request-response.ts";
import { createJsonResponse } from "./lib/json-response/create-json-response.ts";

const requestSchema = z.object({
  deckId: z.number(),
});

export type AddDeckToMineRequest = z.infer<typeof requestSchema>;
export type AddDeckToMineResponse = null;

export const onRequestPost = handleError(async ({ env, request }) => {
  const user = await getUser(request, env);
  if (!user) return createAuthFailedResponse();
  const input = requestSchema.safeParse(await request.json());
  if (!input.success) {
    return createBadRequestResponse();
  }

  const envSafe = envSchema.parse(env);

  await addDeckToMineDb(envSafe, {
    user_id: user.id,
    deck_id: input.data.deckId,
  });

  return createJsonResponse<AddDeckToMineResponse>(null);
});
