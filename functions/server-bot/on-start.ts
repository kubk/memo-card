import { Context } from "grammy";

export const onStart = (ctx: Context) => {
  return ctx.reply(
    `Improve your memory with spaced repetition. Learn languages, history or other subjects with the proven flashcard method.\n\nClick "MemoCard" 👇`,
  );
};
