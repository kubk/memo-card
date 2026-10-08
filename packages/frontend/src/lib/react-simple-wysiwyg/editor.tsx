import { useEffect } from "preact/hooks";
import type { ComponentChildren, HTMLAttributes } from "preact";
import { ContentEditable } from "./content-editable.tsx";
import { useEditorState } from "./editor-context.tsx";

export function Editor({
  children,
  containerProps,
  value,
  onChange,
}: {
  children?: ComponentChildren;
  containerProps?: HTMLAttributes<HTMLDivElement>;
  value: string;
  onChange: (event: { target: { value: string } }) => void;
}) {
  const { setElement, refresh } = useEditorState();

  useEffect(() => {
    document.addEventListener("selectionchange", refresh);
    return () => document.removeEventListener("selectionchange", refresh);
  }, [refresh]);

  return (
    <div className="rsw-editor" {...containerProps}>
      {children}
      <ContentEditable
        value={value}
        onChange={onChange}
        setElement={setElement}
        refresh={refresh}
      />
    </div>
  );
}
