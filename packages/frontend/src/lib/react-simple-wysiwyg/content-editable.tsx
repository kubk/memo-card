import { useCallback, useLayoutEffect, useRef } from "preact/hooks";
import type { TargetedInputEvent } from "preact";
import { normalizeInlineFormatting } from "./normalize-inline-formatting.ts";

function normalizeHtml(value: string) {
  return value.replace(/&nbsp;|\u202F|\u00A0/g, " ");
}

export function ContentEditable({
  value,
  onChange,
  setElement,
  refresh,
}: {
  value: string;
  onChange: (event: { target: { value: string } }) => void;
  setElement: (element: HTMLDivElement | null) => void;
  refresh: () => void;
}) {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const initialHtml = useRef(value);
  const htmlRef = useRef(value);
  const onSetRef = useCallback(
    (element: HTMLDivElement | null) => {
      elementRef.current = element;
      setElement(element);
    },
    [setElement],
  );

  useLayoutEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    if (normalizeHtml(element.innerHTML) !== normalizeHtml(value)) {
      element.innerHTML = value;
      if (document.activeElement === element) {
        const range = document.createRange();
        range.selectNodeContents(element);
        range.collapse(false);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }
    htmlRef.current = element.innerHTML;
  });

  function emitChange() {
    const element = elementRef.current;
    if (!element) return;
    const html = element.innerHTML;
    if (html !== htmlRef.current) {
      htmlRef.current = html;
      onChange({ target: { value: html } });
    }
    refresh();
  }

  function onInput(event: TargetedInputEvent<HTMLDivElement>) {
    if (event.inputType === "insertParagraph") {
      for (const command of ["bold", "italic"]) {
        if (document.queryCommandState(command)) {
          document.execCommand(command);
        }
      }
      const color = document.queryCommandValue("foreColor");
      if (
        color &&
        color !== "inherit" &&
        color !== getComputedStyle(event.currentTarget).color
      ) {
        document.execCommand("foreColor", false, "inherit");
      }
    }
    normalizeInlineFormatting(event.currentTarget);
    emitChange();
  }

  return (
    <div
      className="rsw-ce"
      contentEditable
      dangerouslySetInnerHTML={{ __html: initialHtml.current }}
      ref={onSetRef}
      onInput={onInput}
      onBlur={emitChange}
      onKeyUp={emitChange}
    />
  );
}
