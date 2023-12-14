import { EnvSafe } from "../../env/env-schema.ts";
import { getDatabase } from "../get-database.ts";
import { DatabaseException } from "../database-exception.ts";
import { z } from "zod";

export const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
  logo: z.string().nullable(),
});

export type DeckCategoryDb = z.infer<typeof categorySchema>;

export const getAllCategoriesDb = async (env: EnvSafe) => {
  const db = getDatabase(env);

  const { data: categories, error: categoriesError } = await db
    .from("deck_category")
    .select("*")
    .limit(100);

  if (categoriesError) {
    throw new DatabaseException(categoriesError);
  }

  return z.array(categorySchema).parse(categories);
};
