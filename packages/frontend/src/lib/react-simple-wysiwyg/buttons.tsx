import type { ComponentChildren, TargetedMouseEvent } from "preact";
import { useEditorState } from "./editor-context.tsx";

export function createButton(
  title: string,
  content: ComponentChildren,
  command: (() => void) | "bold" | "italic" | "h1" | "undo",
  focus = true,
) {
  function ButtonFactory() {
    const { element, formatting, refresh } = useEditorState();
    const active =
      typeof command === "string" && command !== "undo" && formatting[command];

    function onAction(event: TargetedMouseEvent<HTMLButtonElement>) {
      event.preventDefault();
      if (focus && document.activeElement !== element) {
        element?.focus();
      }
      if (typeof command === "function") {
        command();
      } else if (command === "h1") {
        document.execCommand(
          "formatBlock",
          false,
          formatting.h1 ? "div" : "h1",
        );
      } else {
        document.execCommand(command);
      }
      refresh();
    }

    return (
      <button
        type="button"
        title={title}
        className="rsw-btn"
        onMouseDown={onAction}
        data-active={active}
      >
        {content}
      </button>
    );
  }
  ButtonFactory.displayName = title.replace(/\s/g, "");
  return ButtonFactory;
}
