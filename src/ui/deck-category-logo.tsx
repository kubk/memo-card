import React from "react";
import { css } from "@emotion/css";
import WebApp from "@twa-dev/sdk";

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

type Props = { logo: string; categoryName: string };

export const DeckCategoryLogo = (props: Props) => {
  const { logo, categoryName } = props;

  if (supportsEmojiFlag) {
    return logo;
  }

  const replacedFlag = replaceFlagEmojiOnWindows(logo);

  return (
    <span
      className={css({ marginRight: 6 })}
      title={`Deck category is ${categoryName}`}
    >
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
