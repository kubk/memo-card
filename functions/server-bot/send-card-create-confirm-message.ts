import { EnvSafe } from "../env/env-schema.ts";
import { Context, InlineKeyboard } from "grammy";
import { assert } from "../lib/typescript/assert.ts";
import {
  userGetServerBotState,
  userSetServerBotState,
} from "../db/user/user-set-server-bot-state.ts";
import { CallbackQueryType } from "./callback-query-type.ts";
import { escapeMarkdown } from "./escape-markdown.ts";

export const sendCardCreateConfirmMessage = async (
  envSafe: EnvSafe,
  ctx: Context,
) => {
  assert(ctx.from);
  const state = await userGetServerBotState(envSafe, ctx.from.id);
  assert(state?.type === "deckSelected");

  await userSetServerBotState(envSafe, ctx.from.id, {
    type: "deckSelected",
    cardBack: state.cardBack,
    cardFront: state.cardFront,
    deckId: state.deckId,
  });

  await ctx.deleteMessage();

  await ctx.reply(
    `Confirm card creation:\n\n*Front:*\n${escapeMarkdown(
      state.cardFront,
    )}\n\n*Back:*\n${escapeMarkdown(state.cardBack)}`,
    {
      parse_mode: "MarkdownV2",
      reply_markup: InlineKeyboard.from([
        [
          InlineKeyboard.text(
            `✅ Confirm`,
            CallbackQueryType.ConfirmCreateCard,
          ),
        ],
        [
          InlineKeyboard.text(`✏️ Edit front`, CallbackQueryType.EditFront),
          InlineKeyboard.text(`✏️ Edit back`, CallbackQueryType.EditBack),
        ],
        [InlineKeyboard.text(`❌ Cancel`, CallbackQueryType.Cancel)],
      ]),
    },
  );
};
