import { EnvSafe } from "../env/env-schema.ts";
import { Context, InlineKeyboard } from "grammy";
import { assert } from "../lib/typescript/assert.ts";
import {
  userGetServerBotState,
  userSetServerBotState,
} from "../db/user/user-set-server-bot-state.ts";
import { CallbackQueryType } from "./callback-query-type.ts";
import { escapeMarkdown } from "./escape-markdown.ts";

const renderFieldValue = (value: string | null) => {
  if (!value) {
    return "_None_";
  }

  return escapeMarkdown(value);
};

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
    cardExample: state.cardExample,
  });

  await ctx.deleteMessage();

  await ctx.reply(
    `Confirm card creation:\n\n*Front:* ${renderFieldValue(
      state.cardFront,
    )}\n\n*Back:* ${renderFieldValue(
      state.cardBack,
    )}\n\n*Example:* ${renderFieldValue(state.cardExample)}`,
    {
      parse_mode: "MarkdownV2",
      reply_markup: InlineKeyboard.from([
        [
          InlineKeyboard.text(`✏️ Edit front`, CallbackQueryType.EditFront),
          InlineKeyboard.text(`✏️ Edit back`, CallbackQueryType.EditBack),
          InlineKeyboard.text(`✏️ Edit example`, CallbackQueryType.EditExample),
        ],
        [
          InlineKeyboard.text(`❌ Cancel`, CallbackQueryType.Cancel),
          InlineKeyboard.text(
            `✅ Confirm`,
            CallbackQueryType.ConfirmCreateCard,
          ),
        ],
      ]),
    },
  );
};
