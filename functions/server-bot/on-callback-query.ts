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

const callbackQueryToHumanReadable = (data: CallbackQueryEdit) => {
  switch (data) {
    case CallbackQueryType.EditFront:
      return "front";
    case CallbackQueryType.EditBack:
      return "back";
    case CallbackQueryType.EditExample:
      return "example";
    default:
      return data satisfies never;
  }
};

export const onCallbackQuery = (envSafe: EnvSafe) => async (ctx: Context) => {
  assert(ctx.callbackQuery);
  assert(ctx.from);

  const data = ctx.callbackQuery.data;
  const db = getDatabase(envSafe);
  if (!data) {
    await ctx.answerCallbackQuery();
    return;
  }

  if (data.startsWith(CallbackQueryType.Deck)) {
    const deckId = Number(data.split(":")[1]);
    if (!deckId) {
      throw new Error(`Deck id ${deckId} is not valid`);
    }
    const state = await userGetServerBotState(envSafe, ctx.from.id);
    if (state?.type !== "cardAdded") {
      return;
    }
    await userSetServerBotState(envSafe, ctx.from.id, {
      type: "deckSelected",
      cardBack: state.cardBack,
      cardFront: state.cardFront,
      cardExample: null,
      deckId,
    });

    await sendCardCreateConfirmMessage(envSafe, ctx);
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
    const editingFieldHuman = callbackQueryToHumanReadable(data);
    await userSetServerBotState(envSafe, ctx.from.id, {
      ...state,
      editingField,
    });
    await ctx.deleteMessage();
    await ctx.reply(`Send a message with the new ${editingFieldHuman}:`);
    return;
  }

  if (data === CallbackQueryType.Cancel) {
    await ctx.answerCallbackQuery("Cancelled");
    await ctx.deleteMessage();
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

    await ctx.reply("Card has been created");
    await ctx.deleteMessage();
    await userSetServerBotState(envSafe, ctx.from.id, null);
    return;
  }

  console.log("Unknown button event with payload", data);
};
