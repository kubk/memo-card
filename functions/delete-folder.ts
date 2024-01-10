import { handleError } from "./lib/handle-error/handle-error.ts";
import { getUser } from "./services/get-user.ts";
import { createAuthFailedResponse } from "./lib/json-response/create-auth-failed-response.ts";
import { envSchema } from "./env/env-schema.ts";
import { createBadRequestResponse } from "./lib/json-response/create-bad-request-response.ts";
import { getFolderByIdAndAuthorId } from "./db/folder/get-folder-by-id-and-author-id.ts";
import { createJsonResponse } from "./lib/json-response/create-json-response.ts";
import { deleteFolderById } from "./db/folder/delete-folder-by-id.ts";
import { getDatabase } from "./db/get-database.ts";

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

  const folderToDelete = await getFolderByIdAndAuthorId(
    envSafe,
    parseInt(folderId),
    // Ignore user.is_admin to avoid accidentally deleting other user's folder
    { ...user, is_admin: false },
  );
  if (folderToDelete) {
    await deleteFolderById(envSafe, parseInt(folderId));
    return createJsonResponse(null);
  }

  const db = getDatabase(envSafe);

  const deleteUserFolderResult = await db
    .from("user_folder")
    .delete()
    .match({
      user_id: user.id,
      folder_id: parseInt(folderId),
    });

  if (deleteUserFolderResult.error) {
    return createBadRequestResponse();
  }
  return createJsonResponse(null);
});
