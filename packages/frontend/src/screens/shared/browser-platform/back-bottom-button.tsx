import { BrowserPlatform } from "../../../lib/platform/browser/browser-platform.ts";
import { platform } from "../../../lib/platform/platform.ts";
import { t } from "../../../translations/t.ts";

export function BackBottomButton({
  isVisible,
  onClick,
}: {
  isVisible: boolean;
  onClick: () => void;
}) {
  if (!(platform instanceof BrowserPlatform) || !isVisible) {
    return null;
  }

  return (
    <button
      type="button"
      className="z-main-button fixed inset-x-0 bottom-[calc(var(--tg-safe-area-inset-bottom,0px)+18px)] mx-auto flex h-[42px] w-[140px] items-center justify-center rounded-[79px] bg-bg text-[14px] leading-none font-medium text-text outline-none transition-transform duration-150 active:scale-[0.98] [-webkit-tap-highlight-color:transparent]"
      onClick={onClick}
    >
      {t("go_back")}
    </button>
  );
}
