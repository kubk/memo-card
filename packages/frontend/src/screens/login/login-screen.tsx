import { LoginButton } from "@telegram-auth/react";
import { platform } from "../../lib/platform/platform.ts";
import { BrowserPlatform } from "../../lib/platform/browser/browser-platform.ts";
import { useState } from "react";
import { t } from "../../translations/t.ts";
import { assert } from "api";
import { TelegramPlatform } from "../../lib/platform/telegram/telegram-platform.ts";
import { ErrorScreen } from "../error-screen/error-screen.tsx";
import { useGoogleOneTapLogin } from "react-google-one-tap-login";
import { Button } from "../../ui/button.tsx";
import { Chrome } from "lucide-react";

export function LoginScreen() {
  const BOT_NAME = import.meta.env.VITE_BOT_NAME;
  assert(BOT_NAME, "VITE_BOT_NAME is not set");

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  assert(googleClientId, "VITE_GOOGLE_CLIENT_ID is not set");

  const [isGoogleSignInHidden, setGoogleSignInHidden] = useState(true);
  const [isGoogleSignInInProgress, setIsGoogleSignInInProgress] =
    useState(false);

  useGoogleOneTapLogin({
    onError: (error) => console.log(error),
    disabled: isGoogleSignInHidden,
    googleAccountConfigs: {
      callback: ({ credential }) => {
        assert(platform instanceof BrowserPlatform);
        platform.handleGoogleAuth(credential);
      },
      client_id: googleClientId,
    },
  });

  if (platform instanceof TelegramPlatform) {
    return <ErrorScreen />;
  }

  return (
    <div className="flex max-w-[350px] justify-center items-center flex-col gap-3.5 bg-bg rounded shadow p-6 pb-12">
      <div className="bg-[#f4f4f4] rounded-full p-1">
        <img
          className="w-[100px] translate-x-0.5 translate-y-1"
          src={"/img/logo.png"}
          alt={"MemoCard logo"}
        />
      </div>
      <h2>MemoCard</h2>
      <div className="w-full flex gap-1 flex-col items-center">
        <div className="w-[219px]">
          <Button
            disabled={isGoogleSignInInProgress}
            icon={<Chrome size={24} />}
            onClick={() => {
              setGoogleSignInHidden(false);
              setIsGoogleSignInInProgress(true);
            }}
          >
            {isGoogleSignInInProgress ? t("ui_loading") : t("login_google")}
          </Button>
        </div>
        <div className="h-[22px]">
          <LoginButton
            showAvatar={false}
            cornerRadius={12}
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
}
