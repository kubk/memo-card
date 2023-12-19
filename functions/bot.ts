import { Bot, webhookCallback } from "grammy";
import { envSchema } from "./env/env-schema.ts";
import { handleError } from "./lib/handle-error/handle-error.ts";
import { createAuthFailedResponse } from "./lib/json-response/create-auth-failed-response.ts";
import { onMessage } from "./server-bot/on-message.ts";
import { onCallbackQuery } from "./server-bot/on-callback-query.ts";
import { onStart } from "./server-bot/on-start.ts";

export const onRequestPost: PagesFunction = handleError(
  async ({ env, request }) => {
    const envSafe = envSchema.parse(env);
    const url = new URL(request.url);
    if (url.searchParams.get("token") !== envSafe.BOT_TOKEN) {
      return createAuthFailedResponse();
    }

    const bot = new Bot(envSafe.BOT_TOKEN);
    bot.command("start", onStart);
    bot.on("message", onMessage(envSafe));
    bot.on("callback_query:data", onCallbackQuery(envSafe));

    const handleWebhook = webhookCallback(bot, "cloudflare-mod");
    return handleWebhook(request);
  },
);
