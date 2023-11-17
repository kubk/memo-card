import React from "react";
import { assert } from "../../lib/typescript/assert.ts";
import { trimEnd } from "../../lib/string/trim.ts";
import WebApp from "@twa-dev/sdk";
import { Button } from "../../ui/button.tsx";

type Props = {
  shareId?: string | null;
  column?: boolean;
};

export const ShareDeckButton = (props: Props) => {
  const { shareId, column } = props;

  const onClick = async () => {
    const botUrl = import.meta.env.VITE_BOT_APP_URL;
    assert(botUrl, "Bot URL is not set");
    const botUrlWithDeckId = `${trimEnd(botUrl, "/")}?startapp=${shareId}`;
    const shareUrl = `https://t.me/share/url?text=&url=${botUrlWithDeckId}`;
    WebApp.openTelegramLink(shareUrl);
  };

  return (
    <Button
      column={column}
      icon={"mdi-share-circle mdi-24px"}
      noPseudoClasses
      outline
      onClick={onClick}
    >
      Share
    </Button>
  );
};
