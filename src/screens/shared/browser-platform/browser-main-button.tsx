import { observer } from "mobx-react-lite";
import { Button } from "../../../ui/button.tsx";
import { theme } from "../../../ui/theme.tsx";
import { platform, platformMaxWidth } from "../../../lib/platform/platform.ts";
import { BrowserPlatform } from "../../../lib/platform/browser/browser-platform.ts";
import { t } from "../../../translations/t.ts";
import { css } from "@emotion/css";
import { assert } from "../../../../shared/typescript/assert.ts";

export const BrowserMainButton = observer(() => {
  if (!(platform instanceof BrowserPlatform)) {
    return null;
  }

  if (!platform.isMainButtonVisible) {
    return null;
  }

  const { mainButtonInfo } = platform;
  assert(mainButtonInfo);

  if (mainButtonInfo.condition && !mainButtonInfo.condition()) {
    return null;
  }

  return (
    <div
      className={css({
        width: "100%",
        maxWidth: platformMaxWidth,
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        margin: "0 auto",
        padding: platform.isMobile ? 16 : "16px 0",
        boxSizing: "border-box",
        zIndex: theme.zIndex.mainButton,
      })}
    >
      <Button
        disabled={platform.isMainButtonLoading.value}
        onClick={mainButtonInfo.onClick}
      >
        {platform.isMainButtonLoading.value
          ? t("ui_loading")
          : mainButtonInfo.text}
      </Button>
    </div>
  );
});
