import "./wysiwyg-field.css";
import {
  createButton,
  Editor,
  EditorProvider,
  Toolbar,
} from "../../lib/react-simple-wysiwyg/index.ts";
import { TextField } from "mobx-form-lite";
import { ValidationError } from "../validation-error.tsx";
import { t } from "../../translations/t.ts";
import { sanitizeTextForCard } from "../../lib/sanitize-html/sanitize-text-for-card.ts";
import { toViewerMediaUrls } from "../../lib/urls/proxy-urls.ts";
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

const BtnBigHeader = createButton(
  t("wysiwyg_big_header"),
  <Heading1Icon className="size-4.5 text-text" />,
  "h1",
);

const BtnBold = createButton(
  t("wysiwyg_bold"),
  <BoldIcon className="size-4.5 text-text" />,
  "bold",
);
const BtnItalic = createButton(
  t("wysiwyg_italic"),
  <ItalicIcon className="size-4.5 text-text" />,
  "italic",
);

const BtnUndo = createButton(
  t("wysiwyg_undo"),
  <UndoIcon className="size-4.5 text-text" />,
  "undo",
);

const BtnClearFormatting = createButton(
  t("wysiwyg_clear_formatting"),
  <RemoveFormattingIcon className="size-4.5 text-text" />,
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
    <TableIcon className="size-4.5 text-text" />,
    () => {
      wysiwygStore.openBottomSheet("table");
    },
  );

  const BtnHelp = createButton(
    "Help",
    <HelpCircleIcon className="size-4.5 text-text" />,
    () => {
      wysiwygStore.openBottomSheet("help");
    },
    false,
  );

  const BtnImage = createButton(
    t("image"),
    <ImageIcon className="size-4.5 text-text" />,
    () => {
      openFilePicker();
    },
  );

  if (allowImage) {
    if (isUploading) {
      return (
        <div className="relative inline-block bg-bg rounded-xl p-2">
          <div className="w-75 h-50 flex items-center justify-center text-hint">
            <Loader2Icon className="size-8 animate-spin" />
          </div>
          {hasError ? <ValidationError error={error} /> : null}
        </div>
      );
    }

    if (imageUrl) {
      return (
        <div className="relative inline-block bg-bg rounded-xl p-2">
          <img
            src={toViewerMediaUrls(imageUrl)}
            className="max-w-75 max-h-75 rounded-lg block"
          />
          <button
            type="button"
            className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white border-none rounded-full w-6 h-6 flex items-center justify-center cursor-pointer"
            onClick={() => {
              onChange("");
            }}
          >
            <XIcon className="size-4" />
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
        title={t("wysiwyg_help_table")}
        isOpen={wysiwygStore.bottomSheet === "table"}
        onClose={() => {
          wysiwygStore.closeBottomSheet();
        }}
      >
        <HtmlTableEditor />
      </BottomSheet>

      <BottomSheet
        title={t("wysiwyg_text_color")}
        isOpen={wysiwygStore.bottomSheet === "colorPicker"}
        onClose={() => {
          wysiwygStore.closeBottomSheet();
        }}
      >
        <ColorPicker onColorSelect={() => wysiwygStore.closeBottomSheet()} />
      </BottomSheet>

      <BottomSheet
        title={t("wysiwyg_help_title")}
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
