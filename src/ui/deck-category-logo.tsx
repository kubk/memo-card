import React from "react";
import { css } from "@emotion/css";
import { t, translateCategory } from "../translations/t.ts";
import { platform } from "../lib/platform/platform.ts";
import { TelegramPlatform } from "../lib/platform/telegram/telegram-platform.ts";

// Windows doesn't support flag emojis, so we replace them with images
// TODO: move to database
export const replaceFlagEmojiOnWindows = (logo: string) => {
  switch (logo) {
    case "🇬🇧":
      return "gb";
    case "🇹🇭":
      return "th";
    default:
      return null;
  }
};

const supportsEmojiFlag =
  platform instanceof TelegramPlatform ? !platform.isTelegramDesktop() : true;

type Props = {
  logo: string;
  categoryName: string;
};

export const DeckCategoryLogo = (props: Props) => {
  const { logo, categoryName } = props;
  const title = `${t("deck_category")}: ${translateCategory(categoryName)}`;

  if (supportsEmojiFlag) {
    return <span title={title}>{logo}</span>;
  }

  const replacedFlag = replaceFlagEmojiOnWindows(logo);

  return (
    <span className={css({ marginRight: 6 })} title={title}>
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
};
