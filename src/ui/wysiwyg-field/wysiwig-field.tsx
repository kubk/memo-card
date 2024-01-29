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
import { TextField } from "../../lib/mobx-form/text-field.ts";
import { ValidationError } from "../validation-error.tsx";
import { ColorIcon } from "./color-icon.tsx";

const BtnBigHeader = createButton(
  "Big header",
  <i className={"mdi mdi-format-header-1"} />,
  () => {
    document.execCommand("formatBlock", false, "h1");
  },
);

const BtnMiddleHeader = createButton(
  "Middle header",
  <i className={"mdi mdi-format-header-3"} />,
  () => {
    document.execCommand("formatBlock", false, "h3");
  },
);

const BtnSmallHeader = createButton(
  "Small header",
  <i className={"mdi mdi-format-header-6"} />,
  () => {
    document.execCommand("formatBlock", false, "h6");
  },
);

export const BtnBold = createButton(
  "Bold",
  <i className={"mdi mdi-format-bold"} />,
  "bold",
);
export const BtnItalic = createButton(
  "Italic",
  <i className={"mdi mdi-format-italic"} />,
  "italic",
);

export const BtnUndo = createButton(
  "Undo",
  <i className={"mdi mdi-undo"} />,
  "undo",
);
export const BtnRedo = createButton(
  "Redo",
  <i className={"mdi mdi-redo"} />,
  "redo",
);

export const BtnGreen = createButton(
  "Green",
  <ColorIcon color={theme.success} />,
  () => {
    document.execCommand("foreColor", false, theme.success);
  },
);

export const BtnRed = createButton(
  "Red",
  <ColorIcon color={theme.danger} />,
  () => {
    document.execCommand("foreColor", false, theme.danger);
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
          onChange(e.target.value);
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
          <BtnUndo />
          <BtnRedo />
        </Toolbar>
      </Editor>
      {hasError ? <ValidationError error={error} /> : null}
    </EditorProvider>
  );
});
