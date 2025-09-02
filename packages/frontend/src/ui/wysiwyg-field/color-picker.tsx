import { t } from "../../translations/t.ts";
import { theme } from "../theme.tsx";

const colors = [
  theme.success,
  theme.icons.blue,
  theme.orange,
  theme.danger,
  theme.icons.pink,
  theme.icons.sea,
  theme.icons.violet,
  theme.dangerLight,
];

type Props = {
  onColorSelect: (color: string) => void;
};

export function ColorPicker({ onColorSelect }: Props) {
  const handleColorClick = (color: string) => {
    document.execCommand("foreColor", false, color);
    onColorSelect(color);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-center">
        {t("wysiwyg_text_color")}
      </h3>
      <div className="grid grid-cols-2 gap-2 w-full max-w-md mx-auto">
        {colors.map((color) => (
          <button
            key={color}
            className="h-12 rounded-lg"
            style={{ backgroundColor: color }}
            onClick={() => handleColorClick(color)}
          />
        ))}
      </div>
    </div>
  );
}
