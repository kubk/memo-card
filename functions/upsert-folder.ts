import { handleError } from "./lib/handle-error/handle-error.ts";
import { getUser } from "./services/get-user.ts";
import { createAuthFailedResponse } from "./lib/json-response/create-auth-failed-response.ts";
import { z } from "zod";
import { createBadRequestResponse } from "./lib/json-response/create-bad-request-response.ts";
import { getDatabase } from "./db/get-database.ts";
import { envSchema } from "./env/env-schema.ts";
import { DatabaseException } from "./db/database-exception.ts";
import { createJsonResponse } from "./lib/json-response/create-json-response.ts";

const requestSchema = z.object({
  id: z.number().optional(),
  title: z.string(),
});

export type AddFolderRequest = z.infer<typeof requestSchema>;
export type AddFolderResponse = null;

export const onRequestPost = handleError(async ({ request, env }) => {
  const user = await getUser(request, env);
  if (!user) return createAuthFailedResponse();

  const input = requestSchema.safeParse(await request.json());
  if (!input.success) {
    return createBadRequestResponse();
  }

  const envSafe = envSchema.parse(env);
  const db = getDatabase(envSafe);
  const { data } = input;

  const upsertFolderResult = await db.from("folder").upsert({
    id: data.id,
    title: data.title,
    author_id: user.id,
  });

  if (upsertFolderResult.error) {
    throw new DatabaseException(upsertFolderResult.error);
  }

  return createJsonResponse<AddFolderResponse>(null);
});
