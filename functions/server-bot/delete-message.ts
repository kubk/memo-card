import { Context } from "grammy";

export const deleteMessage = async (ctx: Context) => {
  try {
    await ctx.deleteMessage();
  } catch (e) {
    console.error(e);
  }
};
