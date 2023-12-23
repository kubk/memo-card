import WebApp from "@twa-dev/sdk";
import { css } from "@emotion/css";
import { theme } from "../../ui/theme.tsx";
import { t } from "../../translations/t.ts";

export const VersionWarning = () => {
  if (WebApp.isVersionAtLeast("6.1")) {
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
