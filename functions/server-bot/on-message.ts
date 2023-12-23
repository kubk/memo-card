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
import { createUserAwareTranslator } from "../translations/create-user-aware-translator.ts";

export const onMessage = (envSafe: EnvSafe) => async (ctx: Context) => {
  if (!ctx.message?.text) {
    return;
  }
  assert(ctx.from);

  await ctx.replyWithChatAction("typing");
  const translator = await createUserAwareTranslator(envSafe, ctx);

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
    await ctx.reply(translator.translate("invalid_card_format"), {
      parse_mode: "MarkdownV2",
    });
    return;
  }

  const decks = await getDecksCreatedByMe(envSafe, ctx.from.id);
  if (decks.length === 0) {
    await ctx.reply(translator.translate("no_decks_created"), {
      reply_markup: new InlineKeyboard().url(
        translator.translate("create_deck"),
        envSafe.VITE_BOT_APP_URL,
      ),
    });
    return;
  }

  await userSetServerBotState(envSafe, ctx.from.id, {
    type: "cardAdded",
    cardFront: cardAsText.front,
    cardBack: cardAsText.back,
  });

  await ctx.reply(translator.translate("create_card_from_deck_message"), {
    reply_markup: InlineKeyboard.from(
      decks
        .map((deck) => [
          InlineKeyboard.text(
            deck.name,
            `${CallbackQueryType.Deck}:${deck.id}`,
          ),
        ])
        .concat([
          [
            InlineKeyboard.text(
              translator.translate("bot_button_cancel"),
              CallbackQueryType.Cancel,
            ),
          ],
        ]),
    ),
  });
};
