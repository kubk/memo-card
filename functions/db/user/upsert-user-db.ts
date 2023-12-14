import { getDatabase } from "../get-database.ts";
import { UserTelegramType } from "../../lib/telegram/validate-telegram-request.ts";
import { EnvSafe } from "../../env/env-schema.ts";
import { DatabaseException } from "../database-exception.ts";
import { z } from "zod";

export const userDbSchema = z.object({
  id: z.number(),
  first_name: z.string().optional().nullable(),
  last_name: z.string().optional().nullable(),
  language_code: z.string().optional().nullable(),
  username: z.string().optional().nullable(),
  is_remind_enabled: z.boolean(),
  is_speaking_card_enabled: z.boolean().nullable(),
  last_reminded_date: z.string().nullable(),
  is_admin: z.boolean(),
});

export type UserDbType = z.infer<typeof userDbSchema>;

export const upsertUserDb = async (
  env: EnvSafe,
  user: UserTelegramType,
): Promise<UserDbType> => {
  const db = getDatabase(env);

  const { data, error } = await db
    .from("user")
    .upsert({
      id: user.id,
      first_name: user.firstName,
      last_name: user.lastName,
      language_code: user.languageCode,
      username: user.username,
      last_used: new Date().toISOString(),
    })
    .select();

  if (error) {
    throw new DatabaseException(error);
  }

  return userDbSchema.parse(data[0]);
};
