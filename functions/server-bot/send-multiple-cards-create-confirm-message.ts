import { EnvSafe } from "../env/env-schema.ts";
import { Context, InlineKeyboard } from "grammy";
import { assert } from "../lib/typescript/assert.ts";
import { userGetServerBotState } from "../db/user/user-set-server-bot-state.ts";
import { CallbackQueryType } from "./callback-query-type.ts";
import { MemoCardTranslator } from "../translations/create-translator.ts";
import { renderManyCardsToCreate } from "./render-many-cards-to-create.ts";

export const sendMultipleCardsCreateConfirmMessage = async (
  envSafe: EnvSafe,
  ctx: Context,
  translator: MemoCardTranslator,
) => {
  assert(ctx.from);
  const state = await userGetServerBotState(envSafe, ctx.from.id);
  if (state?.type !== "deckWithManyCardsSelected") {
    return;
  }

  await ctx.deleteMessage();
  if (state.cards.length === 0) {
    await ctx.reply(translator.translate("no_cards_to_create"));
    return;
  }

  const message = renderManyCardsToCreate(state.cards, translator);

  await ctx.reply(message, {
    parse_mode: "MarkdownV2",
    reply_markup: InlineKeyboard.from([
      [
        InlineKeyboard.text(
          translator.translate("bot_button_cancel"),
          CallbackQueryType.Cancel,
        ),
        InlineKeyboard.text(
          translator.translate("bot_button_confirm"),
          CallbackQueryType.ConfirmCreateManyCards,
        ),
      ],
    ]),
  });
};
