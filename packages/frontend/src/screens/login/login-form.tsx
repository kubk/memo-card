import { Button } from "../../ui/button.tsx";
import { t } from "../../translations/t.ts";
import { LoadingSwap } from "../../ui/loading-swap.tsx";
import { TelegramIcon } from "../shared/telegram/telegram-icon.tsx";
import type { LoginFormStore } from "./login-form-store.ts";

export function LoginForm({
  store,
}: {
  store: Pick<
    LoginFormStore,
    | "isGoogleLoading"
    | "isTelegramLoading"
    | "hasTelegramError"
    | "signInWithGoogle"
    | "signInWithTelegram"
  >;
}) {
  return (
    <div className="m-6 flex w-full max-w-[384px] flex-col gap-8 rounded-[11px] bg-bg p-6 pb-[26px] shadow text-text">
      <div className="flex -translate-x-[11px] items-center justify-center gap-[7px]">
        <img className="size-12" src="/img/logo.png" alt="" />
        <h2 className="text-2xl font-semibold">MemoCard</h2>
      </div>
      <div className="flex w-full flex-col gap-5">
        <Button
          type="button"
          outline
          disabled={store.isGoogleLoading}
          onClick={store.signInWithGoogle}
        >
          <LoadingSwap isLoading={store.isGoogleLoading}>
            <span className="flex items-center justify-center gap-2">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M21.6 12.23c0-.71-.06-1.39-.18-2.05H12v3.88h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.89-1.74 2.98-4.3 2.98-7.36ZM12 22c2.7 0 4.96-.9 6.62-2.41l-3.24-2.51c-.9.6-2.05.96-3.38.96-2.6 0-4.81-1.76-5.6-4.12H3.05v2.59A10 10 0 0 0 12 22ZM6.4 13.92a6 6 0 0 1 0-3.84V7.49H3.05a10 10 0 0 0 0 9.02l3.35-2.59ZM12 5.96c1.47 0 2.79.5 3.82 1.49l2.87-2.87A9.6 9.6 0 0 0 12 2a10 10 0 0 0-8.95 5.49l3.35 2.59C7.19 7.72 9.4 5.96 12 5.96Z" />
              </svg>
              {t("login_google")}
            </span>
          </LoadingSwap>
        </Button>
        <Button
          type="button"
          outline
          disabled={store.isTelegramLoading}
          onClick={store.signInWithTelegram}
        >
          <LoadingSwap isLoading={store.isTelegramLoading}>
            <span className="flex items-center justify-center gap-2">
              <span className="flex size-5 items-center justify-center">
                <TelegramIcon />
              </span>
              {t("login_telegram")}
            </span>
          </LoadingSwap>
        </Button>
        {store.hasTelegramError && (
          <p className="text-sm text-hint">{t("login_telegram_failed")}</p>
        )}
      </div>
    </div>
  );
}
