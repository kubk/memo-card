import { EnvSafe } from "../../env/env-schema.ts";
import { getDatabase } from "../get-database.ts";
import { DatabaseException } from "../database-exception.ts";
import { decksWithCardsSchema } from "./decks-with-cards-schema.ts";

export const getUnAddedPublicDecksDb = async (env: EnvSafe, userId: number) => {
  const db = getDatabase(env);

  const { data, error } = await db.rpc("get_unadded_public_decks_smart", {
    user_id_param: userId,
  });

  if (error) {
    throw new DatabaseException(error);
  }

  return decksWithCardsSchema.parse(
    data.map((item) => {
      const { category_name, category_logo, ...rest } = item;
      return {
        ...rest,
        deck_card: [],
        deck_category: rest.category_id
          ? { name: category_name, logo: category_logo }
          : undefined,
      };
    }),
  );
};
