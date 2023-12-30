import { EnvSafe } from "../../env/env-schema.ts";
import { getDatabase } from "../get-database.ts";
import { DatabaseException } from "../database-exception.ts";
import { z } from "zod";

export const schema = z.object({
  id: z.string(),
  name: z.string(),
});

export type MyDeckFlatDb = z.infer<typeof schema>;

export const getAllMyDecksFlatDb = async (env: EnvSafe, userId: number) => {
  const db = getDatabase(env);

  const { data, error } = await db
    .from("deck")
    .select("id")
    .eq("author_id", userId)
    .limit(500);

  if (error) {
    throw new DatabaseException(error);
  }

  return z.array(schema).parse(data);
};
