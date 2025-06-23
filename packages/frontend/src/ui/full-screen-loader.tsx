import { theme } from "./theme.tsx";
import { Loader2 } from "lucide-react";

type Props = {
  height?: string;
  backgroundColor?: string;
};

export function FullScreenLoader(props: Props) {
  const height = props.height ?? "100vh";
  const backgroundColor = props.backgroundColor ?? theme.secondaryBgColor;

  return (
    <div
      className="flex items-center justify-center"
      style={{ height, backgroundColor }}
    >
      <Loader2 size={48} className="animate-spin" />
    </div>
  );
}

export function ScreenLoader() {
  return <FullScreenLoader height="calc(100vh - 90px)" />;
}
