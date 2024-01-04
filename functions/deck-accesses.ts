import { createJsonResponse } from "./lib/json-response/create-json-response.ts";
import { getUser } from "./services/get-user.ts";
import { createAuthFailedResponse } from "./lib/json-response/create-auth-failed-response.ts";
import { handleError } from "./lib/handle-error/handle-error.ts";
import { envSchema } from "./env/env-schema.ts";
import { createBadRequestResponse } from "./lib/json-response/create-bad-request-response.ts";
import { getLastDeckAccessesForDeckDb } from "./db/deck-access/get-last-deck-accesses-for-deck-db.ts";
import { z } from "zod";

const responseSchema = z.object({
  accesses: z.array(
    z.object({
      used_by: z.number().nullable(),
      share_id: z.string(),
      id: z.number(),
      created_at: z.string(),
      duration_days: z.number().nullable(),
    }),
  ),
});

export type DeckAccessesForDeckTypeDb = z.infer<typeof responseSchema>;

export const onRequest = handleError(async ({ request, env }) => {
  const user = await getUser(request, env);
  if (!user) return createAuthFailedResponse();

  const url = new URL(request.url);
  const deckId = url.searchParams.get("deck_id");
  if (!deckId) {
    return createBadRequestResponse();
  }

  const envSafe = envSchema.parse(env);

  const data = await getLastDeckAccessesForDeckDb(envSafe, Number(deckId));

  return createJsonResponse<DeckAccessesForDeckTypeDb>({
    accesses: data,
  });
});
