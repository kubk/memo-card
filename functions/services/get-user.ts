import { envSchema } from "../env/env-schema.ts";
import { validateTelegramRequest } from "../lib/telegram/validate-telegram-request.ts";
import { upsertUserDb, UserDbType } from "../db/user/upsert-user-db.ts";

export const getUser = async (
  request: Request,
  env: unknown,
): Promise<UserDbType | null> => {
  const queryString = request.headers.get("hash") ?? "";
  const envSafe = envSchema.parse(env);

  const result = await validateTelegramRequest(
    crypto,
    queryString,
    envSafe.BOT_TOKEN,
  );
  if (!result) {
    return null;
  }

  return upsertUserDb(envSafe, result);
};
