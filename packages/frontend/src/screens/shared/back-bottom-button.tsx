import { platform } from "../../lib/platform/platform.ts";
import { TelegramPlatform } from "../../lib/platform/telegram/telegram-platform.ts";
import { t } from "../../translations/t.ts";
import { useEffect, useState } from "preact/compat";

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
        <div className="h-15 shrink-0" />
      ) : null}
      <button
        type="button"
        className="z-main-button fixed inset-x-0 bottom-safe-control mx-auto flex h-10.5 w-35 items-center justify-center rounded-[4.9375rem] border-2 border-secondary-bg bg-bg text-[0.875rem] leading-none font-medium text-text outline-none transition-transform duration-150 active:scale-[0.98] [-webkit-tap-highlight-color:transparent]"
        onClick={onClick}
      >
        {t("go_back")}
      </button>
    </>
  );
}
