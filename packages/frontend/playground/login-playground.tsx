import { useState } from "react";
import { LoginForm } from "../src/screens/login/login-form.tsx";
import {
  BooleanProp,
  PropGroup,
  PropsPanel,
} from "./playground-components.tsx";

export function LoginPlayground() {
  const [googleLoading, setGoogleLoading] = useState(false);
  const [telegramLoading, setTelegramLoading] = useState(false);
  const [telegramError, setTelegramError] = useState(false);

  return (
    <>
      <LoginForm
        store={{
          isGoogleLoading: googleLoading,
          isTelegramLoading: telegramLoading,
          hasTelegramError: telegramError,
          signInWithGoogle: () => setGoogleLoading(true),
          signInWithTelegram: () => setTelegramLoading(true),
        }}
      />
      <PropsPanel>
        <PropGroup label="State">
          <BooleanProp
            id="login-google-loading"
            label="Google loading"
            checked={googleLoading}
            onCheckedChange={setGoogleLoading}
          />
          <BooleanProp
            id="login-telegram-loading"
            label="Telegram loading"
            checked={telegramLoading}
            onCheckedChange={setTelegramLoading}
          />
          <BooleanProp
            id="login-telegram-error"
            label="Telegram error"
            checked={telegramError}
            onCheckedChange={setTelegramError}
          />
        </PropGroup>
      </PropsPanel>
    </>
  );
}
