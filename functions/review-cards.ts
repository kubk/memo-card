import { handleError } from "./lib/handle-error/handle-error.ts";
import { getUser } from "./services/get-user.ts";
import { createAuthFailedResponse } from "./lib/json-response/create-auth-failed-response.ts";
import { z } from "zod";
import { createBadRequestResponse } from "./lib/json-response/create-bad-request-response.ts";
import { envSchema } from "./env/env-schema.ts";
import { getDatabase } from "./db/get-database.ts";
import { tables } from "./db/tables.ts";
import { reviewCard } from "./services/review-card.ts";
import { DateTime } from "luxon";
import { DatabaseException } from "./db/database-exception.ts";
import { createJsonResponse } from "./lib/json-response/create-json-response.ts";

const requestSchema = z.object({
  cards: z.array(
    z.object({
      id: z.number(),
      outcome: z.enum(["correct", "wrong"]),
    }),
  ),
});

export type ReviewCardsRequest = z.infer<typeof requestSchema>;
export type ReviewCardsResponse = null;

export const onRequestPost = handleError(async ({ env, request }) => {
  const user = await getUser(request, env);
  if (!user) return createAuthFailedResponse();

  const input = requestSchema.safeParse(await request.json());
  if (!input.success) {
    return createBadRequestResponse();
  }
  const envSafe = envSchema.parse(env);
  const db = getDatabase(envSafe);

  const { data: existingReviews, error } = await db
    .from(tables.cardReview)
    .select("card_id, interval")
    .eq("user_id", user.id)
    .in(
      "card_id",
      input.data.cards.map((card) => card.id),
    );

  if (error) {
    throw new DatabaseException(error);
  }

  const now = DateTime.now();

  const upsertReviewsResult = await db
    .from(tables.cardReview)
    .upsert(
      input.data.cards.map((card) => {
        const previousInterval = existingReviews.find(
          (review) => review.card_id === card.id,
        )?.interval;

        return {
          user_id: user.id,
          card_id: card.id,
          last_review_date: now.toJSDate(),
          interval: reviewCard(now, previousInterval, card.outcome).interval,
        };
      }),
    )
    .select();

  if (upsertReviewsResult.error) {
    throw new DatabaseException(upsertReviewsResult.error);
  }

  return createJsonResponse<ReviewCardsResponse>(null);
});
