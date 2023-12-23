import { EnvSafe } from "../env/env-schema.ts";
import { Context } from "grammy";
import { createTranslator } from "./create-translator.ts";
import { upsertUserDb } from "../db/user/upsert-user-db.ts";

export const createUserAwareTranslator = async (
  envSafe: EnvSafe,
  ctx: Context,
) => {
  const translator = createTranslator("en");

  if (ctx.from) {
    const userData = await upsertUserDb(envSafe, {
      id: ctx.from.id,
      username: ctx.from.username,
      firstName: ctx.from.first_name,
      lastName: ctx.from.last_name,
      languageCode: ctx.from.language_code,
    });

    if (
      userData.language_code &&
      translator.isSupported(userData.language_code)
    ) {
      translator.setLang(userData.language_code);
    }
  }

  return translator;
};
