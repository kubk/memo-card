import { LoginForm } from "./login-form.tsx";
import { platform } from "../../lib/platform/platform.ts";
import { useState } from "react";
import { assert } from "api";
import { TelegramPlatform } from "../../lib/platform/telegram/telegram-platform.ts";
import { ErrorScreen } from "../error-screen/error-screen.tsx";
import { useGoogleOneTapLogin } from "react-google-one-tap-login";
import { LoginFormStore } from "./login-form-store.ts";

export function LoginScreen() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  assert(googleClientId, "VITE_GOOGLE_CLIENT_ID is not set");

  const [store] = useState(() => new LoginFormStore());

  useGoogleOneTapLogin({
    onError: (error) => console.log(error),
    disabled: !store.isGoogleLoading,
    googleAccountConfigs: {
      callback: store.handleGoogleCredential,
      client_id: googleClientId,
    },
  });

  if (platform instanceof TelegramPlatform) {
    return <ErrorScreen />;
  }

  return <LoginForm store={store} />;
}
