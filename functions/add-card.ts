import { handleError } from "./lib/handle-error/handle-error.ts";
import { getUser } from "./services/get-user.ts";
import { createAuthFailedResponse } from "./lib/json-response/create-auth-failed-response.ts";
import { createBadRequestResponse } from "./lib/json-response/create-bad-request-response.ts";
import { z } from "zod";
import { getDeckByIdAndAuthorId } from "./db/deck/get-deck-by-id-and-author-id.ts";
import { envSchema } from "./env/env-schema.ts";
import { getDatabase } from "./db/get-database.ts";
import { DatabaseException } from "./db/database-exception.ts";
import { createForbiddenRequestResponse } from "./lib/json-response/create-forbidden-request-response.ts";
import { createJsonResponse } from "./lib/json-response/create-json-response.ts";

const requestSchema = z.object({
  deckId: z.number(),
  card: z.object({
    front: z.string(),
    back: z.string(),
    id: z.number().nullable().optional(),
    example: z.string().nullable().optional(),
  }),
});

export type AddCardRequest = z.infer<typeof requestSchema>;
export type AddCardResponse = null;

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
    user.id,
  );
  if (!canEdit) {
    return createForbiddenRequestResponse();
  }

  const db = getDatabase(envSafe);
  const { data } = input;

  const createCardsResult = await db.from("deck_card").insert({
    deck_id: data.deckId,
    front: data.card.front,
    back: data.card.back,
    example: data.card.example,
  });

  if (createCardsResult.error) {
    throw new DatabaseException(createCardsResult.error);
  }

  return createJsonResponse<AddCardResponse>(null, 200);
});
