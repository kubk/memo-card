import { trimEnd } from "../../lib/string/trim.ts";
import { platform } from "../../lib/platform/platform.ts";
import { TelegramPlatform } from "../../lib/platform/telegram/telegram-platform.ts";
import { BrowserPlatform } from "../../lib/platform/browser/browser-platform.ts";
import { links } from "api";
import { copyToClipboard } from "../../lib/copy-to-clipboard/copy-to-clipboard.ts";
import { t } from "../../translations/t.ts";
import { notifyLoading, notifySuccess } from "./snackbar/snackbar.tsx";
import { env } from "../../env.ts";
import { api } from "../../api/trpc-api.ts";

const getDeckOrFolderLink = (shareId: string) => {
  if (platform instanceof BrowserPlatform) {
    return `${trimEnd(links.appBrowser, "/")}/?start=${shareId}`;
  }
  const botUrl = env.VITE_BOT_APP_URL;
  return `${trimEnd(botUrl, "/")}?startapp=${shareId}`;
};

export const canShareMessage = () =>
  platform instanceof TelegramPlatform &&
  !platform.isWeb() &&
  platform.isShareMessageAvailable();

export const copyMemoCardLink = (shareId: string) => {
  copyToClipboard(getDeckOrFolderLink(shareId));
  notifySuccess(t("share_link_copied"), {
    anchorOrigin: { vertical: "top", horizontal: "center" },
  });
};

export const shareMemoCardLink = (shareId: string) => {
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

export const shareMemoCardUrl = ({
  type,
  id,
  shareId,
}: {
  type: "deck" | "folder";
  id: number;
  shareId: string;
}) => {
  const telegramPlatform = platform;
  if (!(telegramPlatform instanceof TelegramPlatform) || !canShareMessage()) {
    shareMemoCardLink(shareId);
    return;
  }

  const loading = notifyLoading(t("share_preparing"));
  api.sharePreparedMessage
    .mutate({ type, id })
    .then(({ id: preparedMessageId }) => {
      telegramPlatform.shareMessage(preparedMessageId);
    })
    .catch((error) => {
      console.error(error);
      shareMemoCardLink(shareId);
    })
    .finally(loading.clear);
};
