import { handleError } from "./lib/handle-error/handle-error.ts";
import { z } from "zod";
import { getUser } from "./services/get-user.ts";
import { createAuthFailedResponse } from "./lib/json-response/create-auth-failed-response.ts";
import { createBadRequestResponse } from "./lib/json-response/create-bad-request-response.ts";
import { envSchema } from "./env/env-schema.ts";
import { getDatabase } from "./db/get-database.ts";
import { DatabaseException } from "./db/database-exception.ts";
import { createJsonResponse } from "./lib/json-response/create-json-response.ts";
import {
  deckSchema,
  DeckWithCardsDbType,
} from "./db/deck/decks-with-cards-schema.ts";
import { addDeckToMineDb } from "./db/deck/add-deck-to-mine-db.ts";
import { createForbiddenRequestResponse } from "./lib/json-response/create-forbidden-request-response.ts";
import { getDeckByIdAndAuthorId } from "./db/deck/get-deck-by-id-and-author-id.ts";
import { shortUniqueId } from "./lib/short-unique-id/short-unique-id.ts";
import { Database } from "./db/databaseTypes.ts";
import { getDeckWithCardsById } from "./db/deck/get-deck-with-cards-by-id-db.ts";
import {
  getManyFoldersWithDecksDb,
  UserFoldersDbType,
} from "./db/folder/get-many-folders-with-decks-db.tsx";
import {
  CardToReviewDbType,
  getCardsToReviewDb,
} from "./db/deck/get-cards-to-review-db.ts";

const requestSchema = z.object({
  id: z.number().nullable().optional(),
  title: z.string(),
  description: z.string().nullable().optional(),
  speakLocale: z.string().nullable().optional(),
  speakField: z.string().nullable().optional(),
  folderId: z.number().nullable().optional(),
  cards: z.array(
    z.object({
      front: z.string(),
      back: z.string(),
      example: z.string().nullable().optional(),
      id: z.number().nullable().optional(),
    }),
  ),
});

export type UpsertDeckRequest = z.infer<typeof requestSchema>;
export type UpsertDeckResponse = {
  deck: DeckWithCardsDbType;
  folders: UserFoldersDbType[];
  cardsToReview: CardToReviewDbType[];
};

type InsertDeckDatabaseType = Database["public"]["Tables"]["deck"]["Insert"];
type DeckRow = Database["public"]["Tables"]["deck"]["Row"];

export const onRequestPost = handleError(async ({ request, env }) => {
  const user = await getUser(request, env);
  if (!user) return createAuthFailedResponse();

  const input = requestSchema.safeParse(await request.json());
  if (!input.success) {
    return createBadRequestResponse();
  }

  const envSafe = envSchema.parse(env);
  const db = getDatabase(envSafe);
  let databaseDeck: DeckRow | null = null;

  if (input.data.id) {
    databaseDeck = await getDeckByIdAndAuthorId(envSafe, input.data.id, user);
    if (!databaseDeck) {
      return createForbiddenRequestResponse();
    }
  }

  // prettier-ignore
  const upsertData: InsertDeckDatabaseType = {
    id: input.data.id ? input.data.id : undefined,
    author_id: user.id,
    name: input.data.title,
    description: input.data.description,
    share_id: input.data.id && databaseDeck ? databaseDeck.share_id : shortUniqueId(),
    is_public: input.data.id && databaseDeck ? databaseDeck.is_public : false,
    speak_field: input.data.speakField,
    speak_locale: input.data.speakLocale,
  };

  const upsertDeckResult = await db
    .from("deck")
    .upsert(upsertData)
    .select()
    .single();

  if (upsertDeckResult.error) {
    throw new DatabaseException(upsertDeckResult.error);
  }

  // Supabase returns an array as a result of upsert, that's why it gets validated against an array here
  const upsertedDeck = deckSchema.parse(upsertDeckResult.data);

  const updateCardsResult = await db.from("deck_card").upsert(
    input.data.cards
      .filter((card) => card.id)
      .map((card) => ({
        id: card.id ?? undefined,
        deck_id: upsertedDeck.id,
        example: card.example,
        front: card.front,
        back: card.back,
      })),
  );

  if (updateCardsResult.error) {
    throw new DatabaseException(updateCardsResult.error);
  }

  const createCardsResult = await db.from("deck_card").insert(
    input.data.cards
      .filter((card) => !card.id)
      .map((card) => ({
        deck_id: upsertedDeck.id,
        example: card.example,
        front: card.front,
        back: card.back,
      })),
  );

  if (createCardsResult.error) {
    throw new DatabaseException(createCardsResult.error);
  }

  // If create deck
  if (!input.data.id) {
    await addDeckToMineDb(envSafe, {
      user_id: user.id,
      deck_id: upsertedDeck.id,
    });

    // If folderId passed - add the new deck to folder
    if (input.data.folderId) {
      await db.from("deck_folder").upsert({
        deck_id: upsertedDeck.id,
        folder_id: input.data.folderId,
      });
    }
  }

  const [deck, folders, cardsToReview] = await Promise.all([
    getDeckWithCardsById(envSafe, upsertedDeck.id),
    getManyFoldersWithDecksDb(envSafe, user.id),
    getCardsToReviewDb(envSafe, user.id),
  ]);

  return createJsonResponse<UpsertDeckResponse>(
    { deck, folders, cardsToReview },
    200,
  );
});
