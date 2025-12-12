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
  ImageIcon,
  XIcon,
  Loader2Icon,
} from "lucide-react";
import { wysiwygStore } from "../../store/wysiwyg-store.ts";
import {
  extractImageUrl,
  renderCardImage,
} from "../../lib/card-image/card-image.ts";
import { useFileUpload } from "../../lib/use-file-upload.tsx";
import { uploadImage } from "../../api/file-upload.ts";
import { useEffect } from "react";

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
    // A hack is used since removeFormat doesn't support clearing H1-H6  tags
    document.execCommand("formatBlock", false, "div");
  },
);

export function WysiwygField({
  field,
  allowImage = true,
}: {
  field: TextField<string>;
  allowImage?: boolean;
}) {
  const { onChange, value, isTouched, error } = field;
  const hasError = isTouched && error;

  const imageUrl = extractImageUrl(value);

  const { renderInput, isUploading, openFilePicker } = useFileUpload({
    onFileUpload: async (file: File) => {
      const { publicUrl } = await uploadImage(file);
      onChange(renderCardImage(publicUrl));
    },
  });

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

  const BtnImage = createButton(
    t("image"),
    <ImageIcon size={18} className="text-text" />,
    () => {
      openFilePicker();
    },
  );

  useEffect(() => {
    console.log("isUploading changed:", isUploading);
  }, [isUploading])

  if (allowImage) {
    if (isUploading) {
      return (
        <div className="relative inline-block bg-bg rounded-xl p-2">
          <div className="w-[300px] h-[200px] flex items-center justify-center text-hint">
            <Loader2Icon className="animate-spin" size={32} />
          </div>
          {hasError ? <ValidationError error={error} /> : null}
        </div>
      );
    }

    if (imageUrl) {
      return (
        <div className="relative inline-block bg-bg rounded-xl p-2">
          <img
            src={imageUrl}
            className="max-w-[300px] max-h-[300px] rounded-lg block"
          />
          <button
            type="button"
            className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white border-none rounded-full w-6 h-6 flex items-center justify-center cursor-pointer"
            onClick={() => {
              onChange("");
            }}
          >
            <XIcon size={16} />
          </button>
          {hasError ? <ValidationError error={error} /> : null}
        </div>
      );
    }
  }

  return (
    <EditorProvider>
      {renderInput()}

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
          {allowImage && <BtnImage />}
          <BtnClearFormatting />
          <BtnUndo />
          <BtnHelp />
        </Toolbar>
      </Editor>
      {hasError ? <ValidationError error={error} /> : null}
    </EditorProvider>
  );
}
