import { EnvSafe } from "../env/env-schema.ts";
import { Context, InlineKeyboard } from "grammy";
import { assert } from "../lib/typescript/assert.ts";
import { userGetServerBotState } from "../db/user/user-set-server-bot-state.ts";
import { CallbackQueryType } from "./callback-query-type.ts";
import { renderFieldValue } from "./render-field-value.ts";
import { MemoCardTranslator } from "../translations/create-translator.ts";

export const sendCardCreateConfirmMessage = async (
  envSafe: EnvSafe,
  ctx: Context,
  translator: MemoCardTranslator,
) => {
  assert(ctx.from);
  const state = await userGetServerBotState(envSafe, ctx.from.id);
  if (state?.type !== "deckSelected") {
    return;
  }

  await ctx.deleteMessage();

  await ctx.reply(
    `${translator.translate("confirm_card_creation_front")}${renderFieldValue(
      state.cardFront,
    )}${translator.translate("confirm_card_creation_back")}${renderFieldValue(
      state.cardBack,
    )}${translator.translate(
      "confirm_card_creation_example",
    )}${renderFieldValue(state.cardExample)}`,
    {
      parse_mode: "MarkdownV2",
      reply_markup: InlineKeyboard.from([
        [
          InlineKeyboard.text(
            translator.translate("bot_button_edit_front"),
            CallbackQueryType.EditFront,
          ),
          InlineKeyboard.text(
            translator.translate("bot_button_edit_back"),
            CallbackQueryType.EditBack,
          ),
          InlineKeyboard.text(
            translator.translate("bot_button_edit_example"),
            CallbackQueryType.EditExample,
          ),
        ],
        [
          InlineKeyboard.text(
            translator.translate("bot_button_cancel"),
            CallbackQueryType.Cancel,
          ),
          InlineKeyboard.text(
            translator.translate("bot_button_confirm"),
            CallbackQueryType.ConfirmCreateCard,
          ),
        ],
      ]),
    },
  );
};
