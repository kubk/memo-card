import { Loader2 } from "lucide-react";

export function Loader() {
  return (
    <div className="w-full text-center">
      <Loader2 size={24} className="animate-spin" />
    </div>
  );
}
