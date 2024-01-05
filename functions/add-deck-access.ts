import { handleError } from "./lib/handle-error/handle-error.ts";
import { getUser } from "./services/get-user.ts";
import { createAuthFailedResponse } from "./lib/json-response/create-auth-failed-response.ts";
import { createBadRequestResponse } from "./lib/json-response/create-bad-request-response.ts";
import { z } from "zod";
import { getDeckByIdAndAuthorId } from "./db/deck/get-deck-by-id-and-author-id.ts";
import { envSchema } from "./env/env-schema.ts";
import { createForbiddenRequestResponse } from "./lib/json-response/create-forbidden-request-response.ts";
import { createJsonResponse } from "./lib/json-response/create-json-response.ts";
import { createDeckAccessDb } from "./db/deck-access/create-deck-access-db.ts";

const requestSchema = z.object({
  deckId: z.number(),
  durationDays: z.number().nullable(),
});

const responseSchema = z.object({
  share_id: z.string(),
});

export type AddDeckAccessRequest = z.infer<typeof requestSchema>;
export type AddDeckAccessResponse = z.infer<typeof responseSchema>;

export const onRequestPost = handleError(async ({ request, env }) => {
  const user = await getUser(request, env);
  if (!user) return createAuthFailedResponse();
  const input = requestSchema.safeParse(await request.json());
  if (!input.success) {
    return createBadRequestResponse();
  }

  const envSafe = envSchema.parse(env);
  const canEdit = await getDeckByIdAndAuthorId(
    envSafe,
    input.data.deckId,
    user,
  );
  if (!canEdit) {
    return createForbiddenRequestResponse();
  }

  const createDeckAccessResult = await createDeckAccessDb(
    envSafe,
    user.id,
    input.data.deckId,
    input.data.durationDays,
  );

  return createJsonResponse<AddDeckAccessResponse>(
    responseSchema.parse(createDeckAccessResult),
    200,
  );
});
