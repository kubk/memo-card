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
    assert(state?.type === "cardAdded", "State is not cardAdded");
    await userSetServerBotState(envSafe, ctx.from.id, {
      type: "deckSelected",
      cardBack: state.cardBack,
      cardFront: state.cardFront,
      deckId,
    });

    await sendCardCreateConfirmMessage(envSafe, ctx);
    await ctx.answerCallbackQuery();
    return;
  }

  if (
    data === CallbackQueryType.EditFront ||
    data === CallbackQueryType.EditBack
  ) {
    const isFront = data === CallbackQueryType.EditFront;
    const state = await userGetServerBotState(envSafe, ctx.from.id);
    assert(state?.type === "deckSelected", "State is not deckSelected");
    await userSetServerBotState(envSafe, ctx.from.id, {
      ...state,
      editingField: isFront ? "cardFront" : "cardBack",
    });
    await ctx.deleteMessage();
    await ctx.reply(
      `Send a message with the new ${isFront ? "front" : "back"}:`,
    );
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
    });

    if (createCardsResult.error) {
      throw new DatabaseException(createCardsResult.error);
    }

    await ctx.reply('Card has been created. Click "MemoCard" to review it 👇');
    await ctx.deleteMessage();
    await userSetServerBotState(envSafe, ctx.from.id, null);
    return;
  }

  console.log("Unknown button event with payload", data);
};
