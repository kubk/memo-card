import { assert } from "../../lib/typescript/assert.ts";
import { trimEnd } from "../../lib/string/trim.ts";
import { platform } from "../../lib/platform/platform.ts";
import { getBotUrl } from "../../lib/urls/get-bot-url.ts";

export const getDeckOrFolderLink = (shareId: string) => {
  const botUrl = getBotUrl();
  assert(botUrl, "Bot URL is not set");
  return `${trimEnd(botUrl, "/")}?startapp=${shareId}`;
};

export const redirectUserToDeckOrFolderLink = (shareId: string) => {
  const botUrlWithDeckId = getDeckOrFolderLink(shareId);
  const shareUrl = `https://t.me/share/url?text=&url=${botUrlWithDeckId}`;
  platform.openInternalLink(shareUrl);
};
