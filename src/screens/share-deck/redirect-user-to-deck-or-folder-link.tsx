import { assert } from "../../lib/typescript/assert.ts";
import { trimEnd } from "../../lib/string/trim.ts";
import WebApp from "@twa-dev/sdk";

export const getDeckOrFolderLink = (shareId: string) => {
  const botUrl = import.meta.env.VITE_BOT_APP_URL;
  assert(botUrl, "Bot URL is not set");
  return `${trimEnd(botUrl, "/")}?startapp=${shareId}`;
};

export const redirectUserToDeckOrFolderLink = (shareId: string) => {
  const botUrlWithDeckId = getDeckOrFolderLink(shareId);
  const shareUrl = `https://t.me/share/url?text=&url=${botUrlWithDeckId}`;
  WebApp.openTelegramLink(shareUrl);
};
