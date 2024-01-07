import { handleError } from "./lib/handle-error/handle-error.ts";
import { getUser } from "./services/get-user.ts";
import { createAuthFailedResponse } from "./lib/json-response/create-auth-failed-response.ts";
import { envSchema } from "./env/env-schema.ts";
import { createBadRequestResponse } from "./lib/json-response/create-bad-request-response.ts";
import { getFolderByIdAndAuthorId } from "./db/folder/get-folder-by-id-and-author-id.ts";
import { createJsonResponse } from "./lib/json-response/create-json-response.ts";
import { deleteFolderById } from "./db/folder/delete-folder-by-id.ts";

export const onRequestPost = handleError(async ({ request, env }) => {
  const user = await getUser(request, env);
  if (!user) {
    return createAuthFailedResponse();
  }
  const envSafe = envSchema.parse(env);

  const url = new URL(request.url);
  const folderId = url.searchParams.get("folder_id");
  if (!folderId) {
    return createBadRequestResponse();
  }

  const canEdit = await getFolderByIdAndAuthorId(
    envSafe,
    parseInt(folderId),
    user,
  );
  if (!canEdit) {
    return createBadRequestResponse();
  }

  await deleteFolderById(envSafe, parseInt(folderId));

  return createJsonResponse(null);
});
