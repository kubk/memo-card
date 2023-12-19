import { Context, NextFunction } from "grammy";

const threshold = 5 * 60; // 5 minutes
export async function ignoreOldMessageMiddleware(
  ctx: Context,
  next: NextFunction
): Promise<void> {
  if (ctx.message) {
    if (new Date().getTime() / 1000 - ctx.message.date < threshold) {
      await next();
    } else {
      console.log(
        `Ignoring message from ${ctx.from?.id ?? 'Unknown ID'} at ${
          ctx.chat?.id ?? 'Unknown Chat ID'
        } (${new Date().getTime() / 1000}:${ctx.message.date})`
      );
    }
  } else {
    await next();
  }
}
