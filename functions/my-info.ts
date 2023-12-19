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

export type MyInfoResponse = {
  user: UserDbType;
  myDecks: DeckWithCardsDbType[];
  publicDecks: DeckWithCardsDbType[];
  cardsToReview: CardToReviewDbType[];
};

export const onRequest = handleError(async ({ request, env }) => {
  const user = await getUser(request, env);
  if (!user) return createAuthFailedResponse();
  const envSafe = envSchema.parse(env);

  const [publicDecks, myDecks, cardsToReview] = await Promise.all([
    await getUnAddedPublicDecksDb(envSafe, user.id),
    await getMyDecksWithCardsDb(envSafe, user.id),
    await getCardsToReviewDb(envSafe, user.id),
  ]);

  return createJsonResponse<MyInfoResponse>({
    user,
    publicDecks,
    myDecks,
    cardsToReview,
  });
});
