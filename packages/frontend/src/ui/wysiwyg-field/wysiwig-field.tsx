import "./wysiwyg-field.css";
import {
  createButton,
  Editor,
  EditorProvider,
  Toolbar,
} from "react-simple-wysiwyg";
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
import { wysiwygStore } from "../../store/wysiwyg-store.ts";

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

export function WysiwygField(props: { field: TextField<string> }) {
  const { field } = props;
  const { onChange, value, isTouched, error, onBlur } = field;
  const hasError = isTouched && error;

  const BtnColorPickerWithAction = createButton(
    t("wysiwyg_text_color"),
    <ColorPickerIcon />,
    () => {
      wysiwygStore.openBottomSheet("colorPicker");
    },
  );

  const BtnTable = createButton(
    "Table",
    <TableIcon size={18} className="text-text" />,
    () => {
      wysiwygStore.openBottomSheet("table");
    },
  );

  const BtnHelp = createButton(
    "Help",
    <HelpCircleIcon size={18} className="text-text" />,
    () => {
      wysiwygStore.openBottomSheet("help");
    },
    // @ts-ignore
    false,
  );

  return (
    <EditorProvider>
      <BottomSheet
        isOpen={wysiwygStore.bottomSheet === "table"}
        onClose={() => {
          wysiwygStore.closeBottomSheet();
        }}
      >
        <HtmlTableEditor />
      </BottomSheet>

      <BottomSheet
        isOpen={wysiwygStore.bottomSheet === "colorPicker"}
        onClose={() => {
          wysiwygStore.closeBottomSheet();
        }}
      >
        <ColorPicker onColorSelect={() => wysiwygStore.closeBottomSheet()} />
      </BottomSheet>

      <BottomSheet
        isOpen={wysiwygStore.bottomSheet === "help"}
        onClose={() => {
          wysiwygStore.closeBottomSheet();
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
