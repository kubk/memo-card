import { Bot, webhookCallback } from "grammy";
import { envSchema } from "./env/env-schema.ts";
import { handleError } from "./lib/handle-error/handle-error.ts";
import { createAuthFailedResponse } from "./lib/json-response/create-auth-failed-response.ts";

export const onRequestPost: PagesFunction = handleError(
  async ({ env, request }) => {
    const envSafe = envSchema.parse(env);
    const url = new URL(request.url);
    if (url.searchParams.get("token") !== envSafe.BOT_TOKEN) {
      return createAuthFailedResponse();
    }

    const bot = new Bot(envSafe.BOT_TOKEN);
    bot.command("start", (ctx) =>
      ctx.reply(
        `Improve your memory with spaced repetition. Learn languages, history or other subjects with the proven flashcard method. Click "MemoCard" 👇`,
      ),
    );

    const handleWebhook = webhookCallback(bot, "cloudflare-mod");
    return handleWebhook(request);
  },
);
