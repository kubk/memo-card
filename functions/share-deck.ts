import { handleError } from "./lib/handle-error/handle-error.ts";
import { z } from "zod";
import ShortUniqueId from "short-unique-id";
import { getUser } from "./services/get-user.ts";
import { createAuthFailedResponse } from "./lib/json-response/create-auth-failed-response.ts";
import { createBadRequestResponse } from "./lib/json-response/create-bad-request-response.ts";
import { envSchema } from "./env/env-schema.ts";
import { getDatabase } from "./db/get-database.ts";
import { tables } from "./db/tables.ts";
import { DatabaseException } from "./db/database-exception.ts";
import { createJsonResponse } from "./lib/json-response/create-json-response.ts";

const requestSchema = z.object({
  deckId: z.number(),
});
const responseSchema = z.object({
  shareId: z.string(),
});

export type ShareDeckRequest = z.infer<typeof requestSchema>;
export type ShareDeckResponse = z.infer<typeof responseSchema>;

export const onRequestPost = handleError(async ({ env, request }) => {
  const user = await getUser(request, env);
  if (!user) return createAuthFailedResponse();

  const input = requestSchema.safeParse(await request.json());
  if (!input.success) {
    return createBadRequestResponse();
  }

  const envSafe = envSchema.parse(env);
  const db = getDatabase(envSafe);

  const getDeckQuery = await db
    .from(tables.deck)
    .select()
    .eq("id", input.data.deckId)
    .not("share_id", "is", null);

  if (getDeckQuery.error) {
    throw new DatabaseException(getDeckQuery.error);
  }

  if (getDeckQuery.data.length > 0) {
    return createJsonResponse(
      responseSchema.parse({
        shareId: getDeckQuery.data[0].share_id,
      }),
    );
  }

  const shareId = new ShortUniqueId({ length: 10 }).rnd();

  const { error } = await db
    .from(tables.deck)
    .update({ share_id: shareId })
    .eq("id", input.data.deckId);

  if (error) {
    throw new DatabaseException(error);
  }

  return createJsonResponse(responseSchema.parse({ shareId }));
});
