import { createJsonResponse } from "./lib/json-response/create-json-response.ts";
import { getUser } from "./services/get-user.ts";
import { createAuthFailedResponse } from "./lib/json-response/create-auth-failed-response.ts";
import { handleError } from "./lib/handle-error/handle-error.ts";
import { envSchema } from "./env/env-schema.ts";
import {
  DeckCategoryDb,
  getAllCategoriesDb,
} from "./db/deck/get-all-categories-db.ts";

export type DeckCategoryResponse = {
  categories: DeckCategoryDb[];
};

export const onRequest = handleError(async ({ request, env }) => {
  const user = await getUser(request, env);
  if (!user) return createAuthFailedResponse();
  const envSafe = envSchema.parse(env);

  const categories = await getAllCategoriesDb(envSafe);

  return createJsonResponse<DeckCategoryResponse>({
    categories: categories,
  });
});
