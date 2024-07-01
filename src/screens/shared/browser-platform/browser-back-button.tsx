import React from "react";
import { observer } from "mobx-react-lite";
import { css, cx } from "@emotion/css";
import { platform } from "../../../lib/platform/platform.ts";
import { BrowserPlatform } from "../../../lib/platform/browser/browser-platform.ts";
import { theme } from "../../../ui/theme.tsx";
import { assert } from "../../../../shared/typescript/assert.ts";

export const BrowserBackButton = observer(() => {
  if (!(platform instanceof BrowserPlatform)) {
    return null;
  }

  return (
    <div
      className={css({
        display: "flex",
        justifyContent: "space-between",
      })}
    >
      {platform.isBackButtonVisible ? (
        <i
          className={cx(
            "mdi mdi-arrow-left-circle mdi-24px",
            css({ color: theme.hintColor, cursor: "pointer" }),
          )}
          onClick={() => {
            assert(platform instanceof BrowserPlatform);
            platform.backButtonInfo?.onClick();
          }}
        />
      ) : null}
    </div>
  );
});
