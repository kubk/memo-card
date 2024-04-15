import "./wysiwyg-field.css";
import { observer } from "mobx-react-lite";
import {
  createButton,
  Editor,
  EditorProvider,
  Toolbar,
} from "react-simple-wysiwyg";
import { theme } from "../theme.tsx";
import React from "react";
import { TextField } from "mobx-form-lite";
import { ValidationError } from "../validation-error.tsx";
import { ColorIcon } from "./color-icon.tsx";
import { t } from "../../translations/t.ts";
import { sanitizeTextForCard } from "../../lib/sanitize-html/sanitize-text-for-card.ts";

const BtnBigHeader = createButton(
  t("wysiwyg_big_header"),
  <i className={"mdi mdi-format-header-1"} />,
  () => {
    document.execCommand("formatBlock", false, "h1");
  },
);

const BtnMiddleHeader = createButton(
  t("wysiwyg_middle_header"),
  <i className={"mdi mdi-format-header-3"} />,
  () => {
    document.execCommand("formatBlock", false, "h3");
  },
);

const BtnSmallHeader = createButton(
  t("wysiwyg_small_header"),
  <i className={"mdi mdi-format-header-6"} />,
  () => {
    document.execCommand("formatBlock", false, "h6");
  },
);

export const BtnBold = createButton(
  t("wysiwyg_bold"),
  <i className={"mdi mdi-format-bold"} />,
  "bold",
);
export const BtnItalic = createButton(
  t("wysiwyg_italic"),
  <i className={"mdi mdi-format-italic"} />,
  "italic",
);

export const BtnUndo = createButton(
  t("wysiwyg_undo"),
  <i className={"mdi mdi-undo"} />,
  "undo",
);
export const BtnRedo = createButton(
  t("wysiwyg_redo"),
  <i className={"mdi mdi-redo"} />,
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
  <i className={"mdi mdi-format-clear"} />,
  () => {
    document.execCommand("removeFormat", false);
    // A hack is used since removeFormat doesn't support clearing H1-H6 tags
    document.execCommand("formatBlock", false, "div");
  },
);

type Props = {
  field: TextField<string>;
};

export const WysiwygField = observer((props: Props) => {
  const { field } = props;
  const { onChange, value, isTouched, error, onBlur } = field;
  const hasError = isTouched && error;

  return (
    <EditorProvider>
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
          <BtnClearFormatting />
          <BtnUndo />
          <BtnRedo />
        </Toolbar>
      </Editor>
      {hasError ? <ValidationError error={error} /> : null}
    </EditorProvider>
  );
});
