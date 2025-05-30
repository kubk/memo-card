import { theme } from "./theme.tsx";

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
      <i className="mdi mdi-loading mdi-spin mdi-48px" />
    </div>
  );
}

export function ScreenLoader() {
  return <FullScreenLoader height="calc(100vh - 90px)" />;
}
