import { createJsonResponse } from "./lib/json-response/create-json-response.ts";
import { getUser } from "./services/get-user.ts";
import { createAuthFailedResponse } from "./lib/json-response/create-auth-failed-response.ts";
import { handleError } from "./lib/handle-error/handle-error.ts";
import { UserDbType } from "./db/user/upsert-user-db.ts";
import { DeckWithCardsDbType } from "./db/deck/decks-with-cards-schema.ts";
import { envSchema } from "./env/env-schema.ts";
import { getMyDecksWithCardsDb } from "./db/deck/get-my-decks-with-cards-db.ts";
import {
  CardToReviewDbType,
  getCardsToReviewDb,
} from "./db/deck/get-cards-to-review-db.ts";
import { getUnAddedPublicDecksDb } from "./db/deck/get-un-added-public-decks-db.ts";
import {
  getFoldersWithDecksDb,
  UserFoldersDbType,
} from "./db/folder/get-folders-with-decks-db.tsx";

export type MyInfoResponse = {
  user: UserDbType;
  myDecks: DeckWithCardsDbType[];
  publicDecks: DeckWithCardsDbType[];
  cardsToReview: CardToReviewDbType[];
  folders: UserFoldersDbType[];
};

export const onRequest = handleError(async ({ request, env }) => {
  const user = await getUser(request, env);
  if (!user) return createAuthFailedResponse();
  const envSafe = envSchema.parse(env);

  const [publicDecks, myDecks, cardsToReview, folders] = await Promise.all([
    await getUnAddedPublicDecksDb(envSafe, user.id),
    await getMyDecksWithCardsDb(envSafe, user.id),
    await getCardsToReviewDb(envSafe, user.id),
    await getFoldersWithDecksDb(envSafe, user.id),
  ]);

  return createJsonResponse<MyInfoResponse>({
    user,
    publicDecks,
    myDecks,
    cardsToReview,
    folders,
  });
});
