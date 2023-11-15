import React from "react";
import { assert } from "../../lib/typescript/assert.ts";
import { trimEnd } from "../../lib/string/trim.ts";
import WebApp from "@twa-dev/sdk";
import { Button } from "../../ui/button.tsx";
import { theme } from "../../ui/theme.tsx";

type Props = {
  deckId: number;
  shareId?: string | null;
};

export const ShareDeckButton = (props: Props) => {
  const { shareId } = props;

  const onClick = async () => {
    const botUrl = import.meta.env.VITE_BOT_APP_URL;
    assert(botUrl, "Bot URL is not set");
    const botUrlWithDeckId = `${trimEnd(botUrl, "/")}?startapp=${shareId}`;
    const shareUrl = `https://t.me/share/url?text=&url=${botUrlWithDeckId}`;
    WebApp.openTelegramLink(shareUrl);
  };

  return (
    <Button icon={"mdi-share"} noPseudoClasses outline onClick={onClick}>
      Share deck
    </Button>
  );
};
