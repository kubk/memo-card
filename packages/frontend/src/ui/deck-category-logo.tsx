import { t, translateCategory } from "../translations/t.ts";
import { platform } from "../lib/platform/platform.ts";
import { TelegramPlatform } from "../lib/platform/telegram/telegram-platform.ts";
import { BrowserPlatform } from "../lib/platform/browser/browser-platform.ts";

// Windows doesn't support flag emojis, so we replace them with images
// TODO: move to database
export const replaceFlagEmojiOnWindows = (logo: string) => {
  switch (logo) {
    case "🇬🇧":
      return "gb";
    case "🇹🇭":
      return "th";
    case "🇪🇸":
      return "es";
    default:
      return null;
  }
};

const supportsEmojiFlag = (() => {
  if (platform instanceof BrowserPlatform) {
    return !platform.isWindows();
  }
  if (platform instanceof TelegramPlatform && platform.isTelegramDesktop()) {
    return false;
  }
  return true;
})();

type Props = {
  logo: string;
  categoryName: string;
};

export function DeckCategoryLogo(props: Props) {
  const { logo, categoryName } = props;
  const title = `${t("deck_category")}: ${translateCategory(categoryName)}`;

  if (supportsEmojiFlag) {
    return <span title={title}>{logo}</span>;
  }

  const replacedFlag = replaceFlagEmojiOnWindows(logo);

  return (
    <span className="mr-1.5" title={title}>
      {replacedFlag ? (
        <img
          src={`https://flagcdn.com/16x12/${replacedFlag}.png`}
          width="16"
          height="12"
          alt={logo}
        />
      ) : (
        logo
      )}
    </span>
  );
}
