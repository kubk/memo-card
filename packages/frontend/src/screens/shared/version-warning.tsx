import { t } from "../../translations/t.ts";
import { platform } from "../../lib/platform/platform.ts";
import { TelegramPlatform } from "../../lib/platform/telegram/telegram-platform.ts";

export function VersionWarning() {
  if (!(platform instanceof TelegramPlatform)) {
    return null;
  }

  if (!platform.isOutdated()) {
    return null;
  }

  return (
    <div className="p-2 flex items-center justify-center flex-col gap-2 bg-danger-light text-text rounded-[12px] mb-2">
      <div>{t("warning_telegram_outdated_title")}</div>
      <div className="text-xs">
        {t("warning_telegram_outdated_description")}
      </div>
    </div>
  );
}
