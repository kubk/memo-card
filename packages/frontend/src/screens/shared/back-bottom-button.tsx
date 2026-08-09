import { platform } from "../../lib/platform/platform.ts";
import { TelegramPlatform } from "../../lib/platform/telegram/telegram-platform.ts";
import { t } from "../../translations/t.ts";
import { useEffect, useState } from "react";

function isTextEditingElement(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  if (target instanceof HTMLTextAreaElement || target.isContentEditable) {
    return true;
  }

  if (!(target instanceof HTMLInputElement)) {
    return false;
  }

  return ![
    "button",
    "checkbox",
    "color",
    "file",
    "hidden",
    "image",
    "radio",
    "range",
    "reset",
    "submit",
  ].includes(target.type);
}

function useIsMobileTextEditing() {
  const [isTextEditing, setIsTextEditing] = useState(false);

  useEffect(() => {
    const update = (target: EventTarget | null) => {
      setIsTextEditing(platform.isMobile && isTextEditingElement(target));
    };
    const handleFocusIn = (event: FocusEvent) => {
      update(event.target);
    };
    const handleFocusOut = (event: FocusEvent) => {
      update(event.relatedTarget);
    };

    update(document.activeElement);
    document.addEventListener("focusin", handleFocusIn);
    document.addEventListener("focusout", handleFocusOut);

    return () => {
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("focusout", handleFocusOut);
    };
  }, []);

  return isTextEditing;
}

export function BackBottomButton({
  isVisible = true,
  onClick,
}: {
  isVisible?: boolean;
  onClick: () => void;
}) {
  const isMobileTextEditing = useIsMobileTextEditing();

  if (!isVisible || isMobileTextEditing) {
    return null;
  }

  return (
    <>
      {platform instanceof TelegramPlatform ? (
        <div className="h-[60px] shrink-0" />
      ) : null}
      <button
        type="button"
        className="z-main-button fixed inset-x-0 bottom-[calc(var(--tg-safe-area-inset-bottom,0px)+18px)] mx-auto flex h-[42px] w-[140px] items-center justify-center rounded-[79px] bg-bg text-[14px] leading-none font-medium text-text outline-none transition-transform duration-150 active:scale-[0.98] [-webkit-tap-highlight-color:transparent]"
        onClick={onClick}
      >
        {t("go_back")}
      </button>
    </>
  );
}
