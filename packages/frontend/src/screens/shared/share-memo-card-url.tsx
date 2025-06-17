import { trimEnd } from "../../lib/string/trim.ts";
import { platform } from "../../lib/platform/platform.ts";
import { TelegramPlatform } from "../../lib/platform/telegram/telegram-platform.ts";
import { BrowserPlatform } from "../../lib/platform/browser/browser-platform.ts";
import { links } from "api";
import { copyToClipboard } from "../../lib/copy-to-clipboard/copy-to-clipboard.ts";
import { t } from "../../translations/t.ts";
import { notifySuccess } from "./snackbar/snackbar.tsx";
import { envSafe } from "../../envSafe.ts";

export const getDeckOrFolderLink = (shareId: string) => {
  if (platform instanceof BrowserPlatform) {
    return `${trimEnd(links.appBrowser, "/")}/?start=${shareId}`;
  }
  const botUrl = envSafe.appBotUrl;
  return `${trimEnd(botUrl, "/")}?startapp=${shareId}`;
};

export const shareMemoCardUrl = (shareId: string) => {
  const memoCardUrl = getDeckOrFolderLink(shareId);

  if (
    platform instanceof BrowserPlatform ||
    (platform instanceof TelegramPlatform && platform.isWeb())
  ) {
    copyToClipboard(memoCardUrl);
    notifySuccess(t("share_link_copied"));
    return;
  }

  if (platform instanceof TelegramPlatform) {
    const shareUrl = `https://t.me/share/url?${
      platform.isMacosWithShareBugs() ? "" : "text=&"
    }url=${memoCardUrl}`;

    platform.openInternalLink(shareUrl);
  }
};
