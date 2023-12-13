import { z } from "zod";

export const deckCardSchema = z.object({
  id: z.number(),
  created_at: z.string(),
  deck_id: z.number(),
  front: z.string(),
  back: z.string(),
  example: z.string().nullable(),
});

const deckSpeakField = z.enum(["front", "back"]);

export const deckSchema = z.object({
  id: z.number(),
  created_at: z.string(),
  name: z.string(),
  author_id: z.number().nullable(),
  description: z.string().nullable(),
  share_id: z.string().nullable(),
  is_public: z.boolean(),
  speak_locale: z.string().nullable(),
  speak_field: deckSpeakField.nullable(),
});

export const deckWithCardsSchema = deckSchema.merge(
  z.object({
    deck_card: z.array(deckCardSchema),
    available_in: z.string().nullable(),
  }),
);

export const decksWithCardsSchema = z.array(deckWithCardsSchema);

export type DeckWithCardsDbType = z.infer<typeof deckWithCardsSchema>;
export type DeckCardDbType = z.infer<typeof deckCardSchema>;
export type DeckSpeakFieldEnum = z.infer<typeof deckSpeakField>;
