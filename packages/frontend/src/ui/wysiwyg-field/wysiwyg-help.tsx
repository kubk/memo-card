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
    <div className="p-6">
      <h3 className="text-xl font-bold mb-6 text-center text-gray-800">
        {t("wysiwyg_help_title")}
      </h3>

      <div className="mb-6">
        <ol className="list-decimal list-inside space-y-2 text-gray-600">
          <li>{t("wysiwyg_help_step1")}</li>
          <li>{t("wysiwyg_help_step2")}</li>
        </ol>
      </div>

      <div className="space-y-3 max-h-[220px] overflow-y-auto md:max-h-none md:overflow-visible">
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <BoldIcon size={18} className="text-gray-700" />
          <span>
            <strong>{t("wysiwyg_help_bold")}</strong>
          </span>
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <ItalicIcon size={18} className="text-gray-700" />
          <span>
            <em>{t("wysiwyg_help_italic")}</em>
          </span>
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <ColorPickerIcon />
          <span>{t("wysiwyg_help_color")}</span>
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <Heading1Icon size={18} className="text-gray-700" />
          <span>{t("wysiwyg_help_heading")}</span>
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <TableIcon size={18} className="text-gray-700" />
          <span>{t("wysiwyg_help_table")}</span>
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <RemoveFormattingIcon size={18} className="text-gray-700" />
          <span>{t("wysiwyg_help_clear")}</span>
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <UndoIcon size={18} className="text-gray-700" />
          <span>{t("wysiwyg_help_undo")}</span>
        </div>
      </div>
    </div>
  );
}
