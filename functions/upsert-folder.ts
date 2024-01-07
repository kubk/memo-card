import { handleError } from "./lib/handle-error/handle-error.ts";
import { getUser } from "./services/get-user.ts";
import { createAuthFailedResponse } from "./lib/json-response/create-auth-failed-response.ts";
import { z } from "zod";
import { createBadRequestResponse } from "./lib/json-response/create-bad-request-response.ts";
import { getDatabase } from "./db/get-database.ts";
import { envSchema } from "./env/env-schema.ts";
import { DatabaseException } from "./db/database-exception.ts";
import { createJsonResponse } from "./lib/json-response/create-json-response.ts";
import {
  getFoldersWithDecksDb,
  UserFoldersDbType,
} from "./db/folder/get-folders-with-decks-db.tsx";
import { getFolderByIdAndAuthorId } from "./db/folder/get-folder-by-id-and-author-id.ts";

const requestSchema = z.object({
  id: z.number().optional(),
  title: z.string(),
  description: z.string().nullable(),
  deckIds: z.array(z.number()),
});

export type AddFolderRequest = z.infer<typeof requestSchema>;
export type AddFolderResponse = {
  folder: {
    id: number;
  }
  folders: UserFoldersDbType[];
};

export const onRequestPost = handleError(async ({ request, env }) => {
  const user = await getUser(request, env);
  if (!user) return createAuthFailedResponse();

  const input = requestSchema.safeParse(await request.json());
  if (!input.success) {
    return createBadRequestResponse();
  }

  const envSafe = envSchema.parse(env);

  const { data } = input;
  if (data.id) {
    const canEdit = await getFolderByIdAndAuthorId(envSafe, data.id, user);
    if (!canEdit) {
      return createBadRequestResponse();
    }
  }

  const db = getDatabase(envSafe);

  const upsertFolderResult = await db
    .from("folder")
    .upsert({
      id: data.id,
      title: data.title,
      description: data.description,
      author_id: user.id,
    })
    .select()
    .single();

  if (upsertFolderResult.error) {
    throw new DatabaseException(upsertFolderResult.error);
  }

  const folderId = upsertFolderResult.data.id;

  const oldDeckFolderResult = await db.from("deck_folder").delete().match({
    folder_id: folderId,
  });

  if (oldDeckFolderResult.error) {
    throw new DatabaseException(oldDeckFolderResult.error);
  }

  const upsertDeckFolderResult = await db.from("deck_folder").upsert(
    data.deckIds.map((deckId) => ({
      deck_id: deckId,
      folder_id: folderId,
    })),
  );

  if (upsertDeckFolderResult.error) {
    throw new DatabaseException(upsertDeckFolderResult.error);
  }

  return createJsonResponse<AddFolderResponse>({
    folder: upsertFolderResult.data,
    folders: await getFoldersWithDecksDb(envSafe, user.id),
  });
});
