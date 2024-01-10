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
import { getFolderByIdAndAuthorId } from "./db/folder/get-folder-by-id-and-author-id.ts";

const requestSchema = z.object({
  deckId: z.number().nullable(),
  folderId: z.number().nullable(),
  durationDays: z.number().nullable(),
  type: z.enum(["deck", "folder"]),
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
  if (input.data.deckId) {
    if (!(await getDeckByIdAndAuthorId(envSafe, input.data.deckId, user))) {
      return createForbiddenRequestResponse();
    }
  }
  if (input.data.folderId) {
    if (!(await getFolderByIdAndAuthorId(envSafe, input.data.folderId, user))) {
      return createForbiddenRequestResponse();
    }
  }

  // Only 1 option from deckId or folderId should be provided
  if (
    (input.data.folderId && input.data.deckId) ||
    (!input.data.folderId && !input.data.deckId)
  ) {
    return createBadRequestResponse();
  }

  const createDeckAccessResult = await createDeckAccessDb(
    envSafe,
    user.id,
    input.data,
  );

  return createJsonResponse<AddDeckAccessResponse>(
    responseSchema.parse(createDeckAccessResult),
    200,
  );
});
