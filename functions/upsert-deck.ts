import { handleError } from "./lib/handle-error/handle-error.ts";
import { z } from "zod";
import { getUser } from "./services/get-user.ts";
import { createAuthFailedResponse } from "./lib/json-response/create-auth-failed-response.ts";
import { createBadRequestResponse } from "./lib/json-response/create-bad-request-response.ts";
import { envSchema } from "./env/env-schema.ts";
import { getDatabase } from "./db/get-database.ts";
import { tables } from "./db/tables.ts";
import { DatabaseException } from "./db/database-exception.ts";
import { createJsonResponse } from "./lib/json-response/create-json-response.ts";
import { deckSchema } from "./db/deck/decks-with-cards-schema.ts";
import { addDeckToMineDb } from "./db/deck/add-deck-to-mine-db.ts";
import { createForbiddenRequestResponse } from "./lib/json-response/create-forbidden-request-response.ts";

const requestSchema = z.object({
  id: z.number().nullable().optional(),
  title: z.string(),
  description: z.string().nullable().optional(),
  cards: z.array(
    z.object({
      front: z.string(),
      back: z.string(),
      id: z.number().nullable().optional(),
    }),
  ),
});

export type UpsertDeckRequest = z.infer<typeof requestSchema>;
export type UpsertDeckResponse = null;

export const onRequestPost = handleError(async ({ request, env }) => {
  const user = await getUser(request, env);
  if (!user) return createAuthFailedResponse();

  const input = requestSchema.safeParse(await request.json());
  if (!input.success) {
    return createBadRequestResponse();
  }

  const envSafe = envSchema.parse(env);
  const db = getDatabase(envSafe);

  // Check user can edit the deck
  if (input.data.id) {
    const canEditDeckResult = await db
      .from(tables.deck)
      .select()
      .eq("author_id", user.id)
      .eq("id", input.data.id);

    if (canEditDeckResult.error) {
      throw new DatabaseException(canEditDeckResult.error);
    }

    if (!canEditDeckResult.data) {
      return createForbiddenRequestResponse();
    }
  }

  const createDeckResult = await db
    .from(tables.deck)
    .upsert({
      id: input.data.id ? input.data.id : undefined,
      author_id: user.id,
      name: input.data.title,
      description: input.data.description,
      is_public: false,
    })
    .select();

  if (createDeckResult.error) {
    throw new DatabaseException(createDeckResult.error);
  }

  const newDeckArray = z.array(deckSchema).parse(createDeckResult.data);

  const updateCardsResult = await db.from(tables.deckCard).upsert(
    input.data.cards
      .filter((card) => card.id)
      .map((card) => ({
        id: card.id,
        deck_id: newDeckArray[0].id,
        front: card.front,
        back: card.back,
      })),
  );

  if (updateCardsResult.error) {
    throw new DatabaseException(updateCardsResult.error);
  }

  const createCardsResult = await db.from(tables.deckCard).insert(
    input.data.cards
      .filter((card) => !card.id)
      .map((card) => ({
        deck_id: newDeckArray[0].id,
        front: card.front,
        back: card.back,
      })),
  );

  if (createCardsResult.error) {
    throw new DatabaseException(createCardsResult.error);
  }

  if (!input.data.id) {
    await addDeckToMineDb(envSafe, {
      user_id: user.id,
      deck_id: newDeckArray[0].id,
    });
  }

  return createJsonResponse<UpsertDeckResponse>(null, 200);
});
