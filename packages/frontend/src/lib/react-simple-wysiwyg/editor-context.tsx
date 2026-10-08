import { createContext } from "preact";
import { useCallback, useContext, useState } from "preact/hooks";
import type { ComponentChildren } from "preact";

type Formatting = { bold: boolean; italic: boolean; h1: boolean };

type EditorState = {
  element: HTMLDivElement | null;
  setElement: (element: HTMLDivElement | null) => void;
  formatting: Formatting;
  refresh: () => void;
};

const EditorContext = createContext<EditorState | undefined>(undefined);

export function EditorProvider({ children }: { children: ComponentChildren }) {
  const [element, setElement] = useState<HTMLDivElement | null>(null);
  const [formatting, setFormatting] = useState<Formatting>({
    bold: false,
    italic: false,
    h1: false,
  });

  const refresh = useCallback(() => {
    const selection = window.getSelection();
    const isSelected =
      !!element &&
      !!selection?.anchorNode &&
      element.contains(selection.anchorNode) &&
      document.activeElement === element;
    const block = isSelected
      ? document.queryCommandValue("formatBlock").toLowerCase()
      : "";
    const anchorElement =
      selection?.anchorNode instanceof Element
        ? selection.anchorNode
        : selection?.anchorNode?.parentElement;
    const bold =
      isSelected &&
      document.queryCommandState("bold") &&
      (!/^h[1-6]$/.test(block) || !!anchorElement?.closest("b, strong"));
    const italic = isSelected && document.queryCommandState("italic");
    const h1 = block === "h1";
    setFormatting((previous) =>
      previous.bold === bold && previous.italic === italic && previous.h1 === h1
        ? previous
        : { bold, italic, h1 },
    );
  }, [element]);

  return (
    <EditorContext.Provider
      value={{ element, setElement, formatting, refresh }}
    >
      {children}
    </EditorContext.Provider>
  );
}

export function useEditorState() {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("You should wrap your component by EditorProvider");
  }
  return context;
}
