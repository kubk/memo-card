import React, { useState } from "react";
import { assert } from "../../lib/typescript/assert.ts";
import { trimEnd } from "../../lib/string/trim.ts";
import WebApp from "@twa-dev/sdk";
import { Button } from "../../ui/button.tsx";
import { shareDeckRequest } from "../../api/api.ts";
import { theme } from "../../ui/theme.tsx";
import { reportClientError } from "../../lib/rollbar/rollbar.tsx";

type Props = {
  deckId: number;
  defaultShareId?: string | null;
};

export const ShareDeckButton = (props: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  // Usually it's an antipattern, but since props.defaultShareId never gets updated, it's ok for now
  const [shareId, setShareId] = useState(props.defaultShareId);

  const onClick = async () => {
    if (shareId) {
      const botUrl = import.meta.env.VITE_BOT_APP_URL;
      assert(botUrl);
      const botUrlWithDeckId = `${trimEnd(botUrl, "/")}?startapp=${shareId}`;
      const shareUrl = `https://t.me/share/url?text=&url=${botUrlWithDeckId}`;
      WebApp.openTelegramLink(shareUrl);
    } else {
      setIsLoading(true);

      try {
        const result = await shareDeckRequest({
          deckId: props.deckId,
        });
        setShareId(result.shareId);
      } catch (e: any) {
        reportClientError("Error while sharing deck: ", e);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Button
      icon={isLoading ? "mdi-loading mdi-spin" : "mdi-share"}
      mainColor={theme.textColor}
      disabled={isLoading}
      onClick={onClick}
      transparent
      outline
    >
      {shareId ? "Share deck" : "Get share link"}
    </Button>
  );
};
