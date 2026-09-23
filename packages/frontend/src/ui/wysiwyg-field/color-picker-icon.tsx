export function ColorPickerIcon() {
  return (
    <div className="w-[18px] h-[18px] grid grid-cols-2 gap-px overflow-hidden rounded">
      <div className="rounded-ss bg-success" />
      <div className="rounded-se bg-icon-blue" />
      <div className="rounded-es bg-orange" />
      <div className="rounded-ee bg-danger" />
    </div>
  );
}
