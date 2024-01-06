import { EnvSafe } from "../env/env-schema.ts";
import { Context } from "grammy";
import { assert } from "../lib/typescript/assert.ts";
import { getDatabase } from "../db/get-database.ts";
import { CallbackQueryType } from "./callback-query-type.ts";
import {
  userGetServerBotState,
  userSetServerBotState,
} from "../db/user/user-set-server-bot-state.ts";
import { sendCardCreateConfirmMessage } from "./send-card-create-confirm-message.ts";
import { DatabaseException } from "../db/database-exception.ts";
import { createUserAwareTranslator } from "../translations/create-user-aware-translator.ts";
import { MemoCardTranslator } from "../translations/create-translator.ts";
import { sendMultipleCardsCreateConfirmMessage } from "./send-multiple-cards-create-confirm-message.ts";
import { deleteMessage } from "./delete-message.ts";

type CallbackQueryEdit =
  | CallbackQueryType.EditFront
  | CallbackQueryType.EditBack
  | CallbackQueryType.EditExample;

const callbackQueryEditTypeToField = (data: CallbackQueryEdit) => {
  switch (data) {
    case CallbackQueryType.EditFront:
      return "cardFront";
    case CallbackQueryType.EditBack:
      return "cardBack";
    case CallbackQueryType.EditExample:
      return "cardExample";
    default:
      return data satisfies never;
  }
};

const callbackQueryToHumanReadable = (
  data: CallbackQueryEdit,
  translator: MemoCardTranslator,
) => {
  switch (data) {
    case CallbackQueryType.EditFront:
      return translator.translate("send_new_front");
    case CallbackQueryType.EditBack:
      return translator.translate("send_new_back");
    case CallbackQueryType.EditExample:
      return translator.translate("send_new_example");
    default:
      return data satisfies never;
  }
};

export const onCallbackQuery = (envSafe: EnvSafe) => async (ctx: Context) => {
  assert(ctx.callbackQuery);
  assert(ctx.from);

  const data = ctx.callbackQuery.data;
  if (!data) {
    await ctx.answerCallbackQuery();
    return;
  }

  const db = getDatabase(envSafe);
  const translator = await createUserAwareTranslator(envSafe, ctx);

  if (data.startsWith(`${CallbackQueryType.Deck}:`)) {
    const deckId = Number(data.split(":")[1]);
    if (!deckId) {
      throw new Error(`Deck id ${deckId} is not valid`);
    }
    const state = await userGetServerBotState(envSafe, ctx.from.id);
    if (
      !state ||
      (state.type !== "cardAdded" && state.type !== "manyCardsAdded")
    ) {
      return;
    }

    if (state.type === "cardAdded") {
      await userSetServerBotState(envSafe, ctx.from.id, {
        type: "deckSelected",
        cardBack: state.cardBack,
        cardFront: state.cardFront,
        cardExample: state.cardExample,
        deckId,
      });

      await sendCardCreateConfirmMessage(envSafe, ctx, translator);
    }

    if (state.type === "manyCardsAdded") {
      await userSetServerBotState(envSafe, ctx.from.id, {
        type: "deckWithManyCardsSelected",
        cards: state.cards,
        deckId,
      });

      await sendMultipleCardsCreateConfirmMessage(envSafe, ctx, translator);
    }

    await ctx.answerCallbackQuery();
    return;
  }

  if (
    data === CallbackQueryType.EditFront ||
    data === CallbackQueryType.EditBack ||
    data === CallbackQueryType.EditExample
  ) {
    const state = await userGetServerBotState(envSafe, ctx.from.id);
    assert(state?.type === "deckSelected", "State is not deckSelected");
    const editingField = callbackQueryEditTypeToField(data);
    const editingFieldHuman = callbackQueryToHumanReadable(data, translator);
    await userSetServerBotState(envSafe, ctx.from.id, {
      ...state,
      editingField,
    });
    await deleteMessage(ctx);
    await ctx.reply(editingFieldHuman);
    return;
  }

  if (data === CallbackQueryType.Cancel) {
    await ctx.answerCallbackQuery(translator.translate("cancelled"));
    await deleteMessage(ctx);
    await userSetServerBotState(envSafe, ctx.from.id, null);
    return;
  }

  if (data === CallbackQueryType.ConfirmCreateCard) {
    const state = await userGetServerBotState(envSafe, ctx.from.id);
    assert(state?.type === "deckSelected", "State is not deckSelected");

    const createCardsResult = await db.from("deck_card").insert({
      deck_id: state.deckId,
      front: state.cardFront,
      back: state.cardBack,
      example: state.cardExample,
    });

    if (createCardsResult.error) {
      throw new DatabaseException(createCardsResult.error);
    }

    await ctx.reply(`${translator.translate("card_created")}`);
    await deleteMessage(ctx);
    await userSetServerBotState(envSafe, ctx.from.id, null);
    return;
  }

  if (data === CallbackQueryType.ConfirmCreateManyCards) {
    const state = await userGetServerBotState(envSafe, ctx.from.id);
    assert(
      state?.type === "deckWithManyCardsSelected",
      "State is not deckWithManyCardsSelected",
    );

    const createCardsResult = await db.from("deck_card").insert(
      state.cards.map((card) => ({
        deck_id: state.deckId,
        front: card.cardFront,
        back: card.cardBack,
        example: card.cardExample,
      })),
    );

    if (createCardsResult.error) {
      throw new DatabaseException(createCardsResult.error);
    }

    await ctx.reply(translator.translate("many_cards_created"));
    await deleteMessage(ctx);
    await userSetServerBotState(envSafe, ctx.from.id, null);
    return;
  }

  console.log("Unknown button event with payload", data);
};
