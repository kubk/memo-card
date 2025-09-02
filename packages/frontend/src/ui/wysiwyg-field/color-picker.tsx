import { t } from "../../translations/t.ts";
import { theme } from "../theme.tsx";

type Props = {
  onColorSelect: (color: string) => void;
};

export function ColorPicker({ onColorSelect }: Props) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-center">
        {t("wysiwyg_text_color")}
      </h3>
      <div className="grid grid-cols-2 gap-2 w-full max-w-md mx-auto">
        <button
          className="h-12 rounded-lg"
          style={{ backgroundColor: theme.success }}
          onClick={() => {
            document.execCommand("foreColor", false, theme.success);
            onColorSelect(theme.success);
          }}
        />
        <button
          className="h-12 rounded-lg"
          style={{ backgroundColor: theme.icons.blue }}
          onClick={() => {
            document.execCommand("foreColor", false, theme.icons.blue);
            onColorSelect(theme.icons.blue);
          }}
        />
        <button
          className="h-12 rounded-lg"
          style={{ backgroundColor: theme.orange }}
          onClick={() => {
            document.execCommand("foreColor", false, theme.orange);
            onColorSelect(theme.orange);
          }}
        />
        <button
          className="h-12 rounded-lg"
          style={{ backgroundColor: theme.danger }}
          onClick={() => {
            document.execCommand("foreColor", false, theme.danger);
            onColorSelect(theme.danger);
          }}
        />
      </div>
    </div>
  );
}
