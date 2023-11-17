import WebApp from "@twa-dev/sdk";
import { css } from "@emotion/css";
import { theme } from "../../ui/theme.tsx";

export const VersionWarning = () => {
  if (WebApp.isVersionAtLeast('6.1')) {
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
      <div>Your Telegram is outdated</div>
      <div
        className={css({
          fontSize: 12,
        })}
      >
        Please update your Telegram to ensure stable functioning of this app.
      </div>
    </div>
  );
};
