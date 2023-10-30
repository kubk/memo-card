import React, { useState } from "react";
import { assert } from "../../lib/typescript/assert.ts";
import { trimEnd } from "../../lib/string/trim.ts";
import WebApp from "@twa-dev/sdk";
import { Button } from "../../ui/button.tsx";
import { shareDeckRequest } from "../../api/api.ts";
import { copyToClipboard } from "./copy-to-clipboard.tsx";
import { showConfirm } from "../../lib/telegram/show-confirm.ts";

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
      const finalUrl = `${trimEnd(botUrl, "/")}?startapp=${shareId}`;
      try {
        await copyToClipboard(finalUrl);
      } catch (e) {
        console.log("Unable to copy", e);
        return;
      }

      const confirmed = await showConfirm(
        "The link has been copied to your clipboard. Close the app, then choose who you'd like to share it with. 😊",
      );
      if (confirmed) {
        WebApp.close();
      }
    } else {
      setIsLoading(true);

      try {
        const result = await shareDeckRequest({
          deckId: props.deckId,
        });
        setShareId(result.shareId);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Button
      icon={isLoading ? "mdi-loading mdi-spin" : "mdi-share"}
      disabled={isLoading}
      onClick={onClick}
      outline
    >
      {shareId ? "Copy share link" : "Get share link"}
    </Button>
  );
};
