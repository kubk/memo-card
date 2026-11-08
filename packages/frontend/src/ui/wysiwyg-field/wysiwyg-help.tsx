import {
  BoldIcon,
  Heading1Icon,
  ItalicIcon,
  RemoveFormattingIcon,
  TableIcon,
  UndoIcon,
} from "lucide-react";
import { ColorPickerIcon } from "./color-picker-icon.tsx";
import { t } from "../../translations/t.ts";

export function WysiwygHelp() {
  return (
    <div className="p-2">
      <div className="mb-6">
        <ol className="list-decimal list-inside space-y-2 text-text">
          <li>{t("wysiwyg_help_step1")}</li>
          <li>{t("wysiwyg_help_step2")}</li>
        </ol>
      </div>

      <div className="space-y-3 max-h-55 overflow-y-auto md:max-h-none md:overflow-visible">
        <div className="flex items-center gap-3 p-3 bg-secondary-bg rounded-lg">
          <BoldIcon className="size-4.5 text-text" />
          <span>
            <strong>{t("wysiwyg_help_bold")}</strong>
          </span>
        </div>

        <div className="flex items-center gap-3 p-3 bg-secondary-bg rounded-lg">
          <ItalicIcon className="size-4.5 text-text" />
          <span>
            <em>{t("wysiwyg_help_italic")}</em>
          </span>
        </div>

        <div className="flex items-center gap-3 p-3 bg-secondary-bg rounded-lg">
          <ColorPickerIcon />
          <span>{t("wysiwyg_help_color")}</span>
        </div>

        <div className="flex items-center gap-3 p-3 bg-secondary-bg rounded-lg">
          <Heading1Icon className="size-4.5 text-text" />
          <span>{t("wysiwyg_help_heading")}</span>
        </div>

        <div className="flex items-center gap-3 p-3 bg-secondary-bg rounded-lg">
          <TableIcon className="size-4.5 text-text" />
          <span>{t("wysiwyg_help_table")}</span>
        </div>

        <div className="flex items-center gap-3 p-3 bg-secondary-bg rounded-lg">
          <RemoveFormattingIcon className="size-4.5 text-text" />
          <span>{t("wysiwyg_help_clear")}</span>
        </div>

        <div className="flex items-center gap-3 p-3 bg-secondary-bg rounded-lg">
          <UndoIcon className="size-4.5 text-text" />
          <span>{t("wysiwyg_help_undo")}</span>
        </div>
      </div>
    </div>
  );
}
