import { Context } from "grammy";

export const deleteMessage = async (ctx: Context) => {
  try {
    await ctx.deleteMessage();
  } catch (e) {
    // If the message can't be deleted because it's too old, ignore the error
    console.error(e);
  }
};
