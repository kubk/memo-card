import "./wysiwyg-field.css";
import {
  createButton,
  Editor,
  EditorProvider,
  Toolbar,
} from "react-simple-wysiwyg";
import { useState } from "react";
import { TextField } from "mobx-form-lite";
import { ValidationError } from "../validation-error.tsx";
import { t } from "../../translations/t.ts";
import { sanitizeTextForCard } from "../../lib/sanitize-html/sanitize-text-for-card.ts";
import { BottomSheet } from "../bottom-sheet/bottom-sheet.tsx";
import { HtmlTableEditor } from "./html-table-editor.tsx";
import { ColorPickerIcon } from "./color-picker-icon.tsx";
import { ColorPicker } from "./color-picker.tsx";
import { WysiwygHelp } from "./wysiwyg-help.tsx";
import {
  BoldIcon,
  Heading1Icon,
  ItalicIcon,
  RemoveFormattingIcon,
  TableIcon,
  UndoIcon,
  HelpCircleIcon,
} from "lucide-react";

const BtnBigHeader = createButton(
  t("wysiwyg_big_header"),
  <Heading1Icon size={18} className="text-text" />,
  () => {
    document.execCommand("formatBlock", false, "h1");
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
  const [isColorPicker, setIsColorPicker] = useState(false);
  const [isHelp, setIsHelp] = useState(false);

  const BtnColorPickerWithAction = createButton(
    t("wysiwyg_text_color"),
    <ColorPickerIcon />,
    () => {
      setIsColorPicker(true);
    },
  );

  const BtnTable = createButton(
    "Table",
    <TableIcon size={18} className="text-text" />,
    () => {
      setIsTable(true);
    },
  );

  const BtnHelp = createButton(
    "Help",
    <HelpCircleIcon size={18} className="text-text" />,
    () => {
      setIsHelp(true);
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

      <BottomSheet
        isOpen={isColorPicker}
        onClose={() => {
          setIsColorPicker(false);
        }}
      >
        <ColorPicker onColorSelect={() => setIsColorPicker(false)} />
      </BottomSheet>

      <BottomSheet
        isOpen={isHelp}
        onClose={() => {
          setIsHelp(false);
        }}
      >
        <WysiwygHelp />
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
          <BtnColorPickerWithAction />
          <BtnBigHeader />
          <BtnTable />
          <BtnClearFormatting />
          <BtnUndo />
          <BtnHelp />
        </Toolbar>
      </Editor>
      {hasError ? <ValidationError error={error} /> : null}
    </EditorProvider>
  );
}
