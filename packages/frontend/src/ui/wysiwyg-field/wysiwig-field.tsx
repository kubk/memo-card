import "./wysiwyg-field.css";
import {
  createButton,
  Editor,
  EditorProvider,
  Toolbar,
} from "react-simple-wysiwyg";
import { theme } from "../theme.tsx";
import { useState } from "react";
import { TextField } from "mobx-form-lite";
import { ValidationError } from "../validation-error.tsx";
import { ColorIcon } from "./color-icon.tsx";
import { t } from "../../translations/t.ts";
import { sanitizeTextForCard } from "../../lib/sanitize-html/sanitize-text-for-card.ts";
import { BottomSheet } from "../bottom-sheet/bottom-sheet.tsx";
import { HtmlTableEditor } from "./html-table-editor.tsx";
import {
  BoldIcon,
  Heading1Icon,
  Heading3Icon,
  Heading6Icon,
  ItalicIcon,
  RedoIcon,
  RemoveFormattingIcon,
  TableIcon,
  UndoIcon,
} from "lucide-react";

const BtnBigHeader = createButton(
  t("wysiwyg_big_header"),
  <Heading1Icon size={18} className="text-text" />,
  () => {
    document.execCommand("formatBlock", false, "h1");
  },
);

const BtnMiddleHeader = createButton(
  t("wysiwyg_middle_header"),
  <Heading3Icon size={18} className="text-text" />,
  () => {
    document.execCommand("formatBlock", false, "h3");
  },
);

const BtnSmallHeader = createButton(
  t("wysiwyg_small_header"),
  <Heading6Icon size={18} className="text-text" />,
  () => {
    document.execCommand("formatBlock", false, "h6");
  },
);

export const BtnBold = createButton(
  t("wysiwyg_bold"),
  <BoldIcon size={18} className="text-text" />,
  "bold",
);
export const BtnItalic = createButton(
  t("wysiwyg_italic"),
  <ItalicIcon size={18} className="text-text" />,
  "italic",
);

export const BtnUndo = createButton(
  t("wysiwyg_undo"),
  <UndoIcon size={18} className="text-text" />,
  "undo",
);
export const BtnRedo = createButton(
  t("wysiwyg_redo"),
  <RedoIcon size={18} className="text-text" />,
  "redo",
);

export const BtnGreen = createButton(
  t("wysiwyg_green"),
  <ColorIcon color={theme.success} />,
  () => {
    document.execCommand("foreColor", false, theme.success);
  },
);

export const BtnRed = createButton(
  t("wysiwyg_red"),
  <ColorIcon color={theme.danger} />,
  () => {
    document.execCommand("foreColor", false, theme.danger);
  },
);

export const BtnClearFormatting = createButton(
  t("wysiwyg_clear_formatting"),
  <RemoveFormattingIcon size={18} className="text-text" />,
  () => {
    document.execCommand("removeFormat", false);
    // A hack is used since removeFormat doesn't support clearing H1-H6 tags
    document.execCommand("formatBlock", false, "div");
  },
);

type Props = {
  field: TextField<string>;
};

export function WysiwygField(props: Props) {
  const { field } = props;
  const { onChange, value, isTouched, error, onBlur } = field;
  const hasError = isTouched && error;
  const [isTable, setIsTable] = useState(false);

  const BtnTable = createButton(
    "Table",
    <TableIcon size={18} className="text-text" />,
    () => {
      setIsTable(true);
    },
  );

  return (
    <EditorProvider>
      <BottomSheet
        isOpen={isTable}
        onClose={() => {
          setIsTable(false);
        }}
      >
        <HtmlTableEditor />
      </BottomSheet>

      <Editor
        onBlur={onBlur}
        containerProps={
          hasError
            ? {
                // A hack to mark the field as invalid
                // @ts-ignore
                "data-invalid": "1",
              }
            : undefined
        }
        value={value}
        onChange={(e) => {
          onChange(sanitizeTextForCard(e.target.value));
        }}
      >
        <Toolbar>
          <BtnBold />
          <BtnItalic />
          <BtnRed />
          <BtnGreen />
          <BtnBigHeader />
          <BtnMiddleHeader />
          <BtnSmallHeader />
          <BtnTable />
          <BtnClearFormatting />
          <BtnUndo />
          <BtnRedo />
        </Toolbar>
      </Editor>
      {hasError ? <ValidationError error={error} /> : null}
    </EditorProvider>
  );
}
