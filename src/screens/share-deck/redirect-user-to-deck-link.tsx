import { assert } from "../../lib/typescript/assert.ts";
import { trimEnd } from "../../lib/string/trim.ts";
import WebApp from "@twa-dev/sdk";

export const getDeckLink = (shareId: string) => {
  const botUrl = import.meta.env.VITE_BOT_APP_URL;
  assert(botUrl, "Bot URL is not set");
  return `${trimEnd(botUrl, "/")}?startapp=${shareId}`;
};

export const redirectUserToDeckLink = (shareId: string) => {
  const botUrlWithDeckId = getDeckLink(shareId);
  const shareUrl = `https://t.me/share/url?text=&url=${botUrlWithDeckId}`;
  WebApp.openTelegramLink(shareUrl);
};
