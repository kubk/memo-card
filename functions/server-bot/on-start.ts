import { Context } from "grammy";
import { EnvSafe } from "../env/env-schema.ts";
import { createUserAwareTranslator } from "../translations/create-user-aware-translator.ts";

export const onStart = (envSafe: EnvSafe) => async (ctx: Context) => {
  await ctx.replyWithChatAction("typing");
  const translator = await createUserAwareTranslator(envSafe, ctx);

  return ctx.reply(translator.translate("start"));
};
