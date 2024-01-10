import React from "react";
import { css } from "@emotion/css";
import WebApp from "@twa-dev/sdk";
import { t, translateCategory } from "../translations/t.ts";

// Windows doesn't support flag emojis, so we replace them with images
export const replaceFlagEmojiOnWindows = (logo: string) => {
  switch (logo) {
    case "🇬🇧":
      return "gb";
    default:
      return null;
  }
};

const supportsEmojiFlag = WebApp.platform !== "tdesktop";

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
