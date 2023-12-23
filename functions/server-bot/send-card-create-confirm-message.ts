import { EnvSafe } from "../env/env-schema.ts";
import { Context, InlineKeyboard } from "grammy";
import { assert } from "../lib/typescript/assert.ts";
import {
  userGetServerBotState,
  userSetServerBotState,
} from "../db/user/user-set-server-bot-state.ts";
import { CallbackQueryType } from "./callback-query-type.ts";
import { escapeMarkdown } from "./escape-markdown.ts";
import { createUserAwareTranslator } from "../translations/create-user-aware-translator.ts";

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
  const translator = await createUserAwareTranslator(envSafe, ctx);
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
