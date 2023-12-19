import { EnvSafe } from "../env/env-schema.ts";
import { Context, InlineKeyboard } from "grammy";
import { assert } from "../lib/typescript/assert.ts";
import {
  userGetServerBotState,
  userSetServerBotState,
} from "../db/user/user-set-server-bot-state.ts";
import { sendCardCreateConfirmMessage } from "./send-card-create-confirm-message.ts";
import { parseDeckFromText } from "./parse-deck-from-text.ts";
import { getDecksCreatedByMe } from "../db/deck/get-decks-created-by-me.ts";
import { CallbackQueryType } from "./callback-query-type.ts";

export const onMessage = (envSafe: EnvSafe) => async (ctx: Context) => {
  if (!ctx.message?.text) {
    return;
  }
  assert(ctx.from);

  await ctx.replyWithChatAction("typing");

  const userState = await userGetServerBotState(envSafe, ctx.from.id);
  if (userState?.type === "deckSelected" && userState.editingField) {
    await userSetServerBotState(envSafe, ctx.from.id, {
      ...userState,
      [userState.editingField]: ctx.message.text,
      editingField: undefined,
    });

    await sendCardCreateConfirmMessage(envSafe, ctx);

    return;
  }

  const cardAsText = parseDeckFromText(ctx.message.text);
  if (!cardAsText) {
    await ctx.reply(
      "Please send a message in the format: `front \\- back`\n\n*Example:*\nMe gusta \\- I like it",
      {
        parse_mode: "MarkdownV2",
      },
    );
    return;
  }

  const decks = await getDecksCreatedByMe(envSafe, ctx.from.id);
  if (decks.length === 0) {
    await ctx.reply(
      `You don't have any personal decks yet. Create one in the app first 👇`,
    );
    return;
  }

  await userSetServerBotState(envSafe, ctx.from.id, {
    type: "cardAdded",
    cardFront: cardAsText.front,
    cardBack: cardAsText.back,
  });

  await ctx.reply("To create a card from it, select a deck: ", {
    reply_markup: InlineKeyboard.from(
      decks
        .map((deck) => [
          InlineKeyboard.text(
            deck.name,
            `${CallbackQueryType.Deck}:${deck.id}`,
          ),
        ])
        .concat([[InlineKeyboard.text("❌ Cancel", CallbackQueryType.Cancel)]]),
    ),
  });
};
