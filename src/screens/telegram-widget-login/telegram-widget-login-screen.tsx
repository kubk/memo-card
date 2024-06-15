import { observer } from "mobx-react-lite";
import { LoginButton } from "@telegram-auth/react";
import { platform } from "../../lib/platform/platform.ts";
import { BrowserPlatform } from "../../lib/platform/browser/browser-platform.ts";
import { assert } from "../../lib/typescript/assert.ts";
import React from "react";
import { css } from "@emotion/css";
import { theme } from "../../ui/theme.tsx";
import { t } from "../../translations/t.ts";

const BOT_NAME = import.meta.env.VITE_BOT_NAME;
assert(BOT_NAME, "VITE_BOT_NAME is not set");

export const TelegramWidgetLoginScreen = observer(() => {
  return (
    <div
      className={css({
        height: "calc(100vh - 120px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 12,
        padding: '0 24px',
      })}
    >
      <h2>{t("login")}</h2>
      <div
        className={css({
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 32,
          backgroundColor: theme.bgColor,
          borderRadius: theme.borderRadius,
          padding: 24,
        })}
      >
        <img
          className={css({
            width: 180,
          })}
          src={"/img/full-logo.jpg"}
          alt={"MemoCard logo"}
        />
        <div
          className={css({
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          })}
        >
          <LoginButton
            botUsername={BOT_NAME}
            onAuthCallback={(data) => {
              assert(platform instanceof BrowserPlatform);
              platform.handleTelegramWidgetLogin(data);
            }}
          />
        </div>
      </div>
    </div>
  );
});
