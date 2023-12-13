import { createJsonResponse } from "./lib/json-response/create-json-response.ts";
import { getUser } from "./services/get-user.ts";
import { createAuthFailedResponse } from "./lib/json-response/create-auth-failed-response.ts";
import { handleError } from "./lib/handle-error/handle-error.ts";
import { envSchema } from "./env/env-schema.ts";
import { getDeckWithCardsById } from "./db/deck/get-deck-with-cards-by-id-db.ts";
import { createBadRequestResponse } from "./lib/json-response/create-bad-request-response.ts";
import { shortUniqueId } from "./lib/short-unique-id/short-unique-id.ts";
import { getDatabase } from "./db/get-database.ts";
import { DatabaseException } from "./db/database-exception.ts";
import { addDeckToMineDb } from "./db/deck/add-deck-to-mine-db.ts";

export type CopyDeckResponse = null;

export const onRequestPost = handleError(async ({ request, env }) => {
  const user = await getUser(request, env);
  if (!user || !user.is_admin) {
    return createAuthFailedResponse();
  }
  const envSafe = envSchema.parse(env);

  const url = new URL(request.url);
  const deckId = url.searchParams.get("deck_id");
  if (!deckId) {
    return createBadRequestResponse();
  }

  const db = getDatabase(envSafe);
  const deck = await getDeckWithCardsById(envSafe, parseInt(deckId));

  // prettier-ignore
  const insertData = {
    author_id: user.id,
    name: `${deck.name} (copy)`,
    description: deck.description,
    share_id: shortUniqueId(),
    is_public: false,
    speak_field: deck.speak_field,
    speak_locale: deck.speak_locale,
  };

  const insertDeckResult = await db
    .from("deck")
    .insert(insertData)
    .select()
    .single();

  if (insertDeckResult.error) {
    throw new DatabaseException(insertDeckResult.error);
  }

  const createCardsResult = await db.from("deck_card").insert(
    deck.deck_card.map((card) => ({
      deck_id: insertDeckResult.data.id,
      example: card.example,
      front: card.front,
      back: card.back,
    })),
  );

  await addDeckToMineDb(envSafe, {
    user_id: user.id,
    deck_id: insertDeckResult.data.id,
  });

  if (createCardsResult.error) {
    throw new DatabaseException(createCardsResult.error);
  }

  return createJsonResponse<CopyDeckResponse>(null);
});
