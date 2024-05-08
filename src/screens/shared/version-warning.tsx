import { css } from "@emotion/css";
import { theme } from "../../ui/theme.tsx";
import { t } from "../../translations/t.ts";
import { platform } from "../../lib/platform/platform.ts";
import { TelegramPlatform } from "../../lib/platform/telegram/telegram-platform.ts";

export const VersionWarning = () => {
  if (!(platform instanceof TelegramPlatform)) {
    return null;
  }

  if (!platform.isOutdated()) {
    return null;
  }

  return (
    <div
      className={css({
        padding: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 8,
        backgroundColor: theme.dangerLight,
        color: theme.textColor,
        borderRadius: theme.borderRadius,
        marginBottom: 8,
      })}
    >
      <div>{t("warning_telegram_outdated_title")}</div>
      <div
        className={css({
          fontSize: 12,
        })}
      >
        {t("warning_telegram_outdated_description")}
      </div>
    </div>
  );
};
