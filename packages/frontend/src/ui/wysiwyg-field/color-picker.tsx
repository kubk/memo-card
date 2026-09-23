import { cn } from "../cn.ts";

const colors = [
  { className: "bg-success", value: "#2ecb47" },
  { className: "bg-icon-blue", value: "#0e77f1" },
  { className: "bg-orange", value: "#FF9F0A" },
  { className: "bg-danger", value: "#fc2025" },
  { className: "bg-icon-pink", value: "#c72ab9" },
  { className: "bg-icon-sea", value: "#1abe8a" },
  { className: "bg-icon-violet", value: "#5454d6" },
  { className: "bg-danger-light", value: "#fc202566" },
] as const;

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
      <div className="grid grid-cols-2 gap-2 w-full max-w-md mx-auto">
        {colors.map((color) => (
          <button
            key={color.className}
            className={cn("h-12 rounded-lg", color.className)}
            onClick={() => handleColorClick(color.value)}
          />
        ))}
      </div>
    </div>
  );
}
