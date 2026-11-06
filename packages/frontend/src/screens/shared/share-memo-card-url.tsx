import { platform } from "../../lib/platform/platform.ts";
import { TelegramPlatform } from "../../lib/platform/telegram/telegram-platform.ts";
import { BrowserPlatform } from "../../lib/platform/browser/browser-platform.ts";
import { getTelegramAppLink, getWebAppLink, links } from "api";
import { copyToClipboard } from "../../lib/copy-to-clipboard/copy-to-clipboard.ts";
import { t } from "../../translations/t.ts";
import { notifyLoading, notifySuccess } from "./snackbar/snackbar.tsx";
import { env } from "../../env.ts";
import { api } from "../../api/trpc-api.ts";

const getDeckOrFolderLink = (id: string) =>
  platform instanceof BrowserPlatform
    ? getWebAppLink(links.appBrowser, id)
    : getTelegramAppLink(env.VITE_BOT_APP_URL, id);

export const canShareMessage = () =>
  platform instanceof TelegramPlatform &&
  !platform.isWeb() &&
  platform.isShareMessageAvailable();

export const copyMemoCardLink = (id: string) => {
  copyToClipboard(getDeckOrFolderLink(id));
  notifySuccess(t("share_link_copied"));
};

const shareMemoCardLink = (id: string) => {
  const memoCardUrl = getDeckOrFolderLink(id);

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
}: {
  type: "deck" | "folder";
  id: string;
}) => {
  const telegramPlatform = platform;
  if (!(telegramPlatform instanceof TelegramPlatform) || !canShareMessage()) {
    shareMemoCardLink(id);
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
      shareMemoCardLink(id);
    })
    .finally(loading.clear);
};
