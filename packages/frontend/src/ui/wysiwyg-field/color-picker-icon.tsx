export function ColorPickerIcon() {
  return (
    <div className="w-4.5 h-4.5 grid grid-cols-2 gap-px overflow-hidden rounded">
      <div className="rounded-ss bg-success" />
      <div className="rounded-se bg-icon-blue" />
      <div className="rounded-es bg-orange" />
      <div className="rounded-ee bg-danger" />
    </div>
  );
}
