import { ChevronIcon } from "./chevron-icon";

type ListRightTextParams = {
  text: string;
  cut?: boolean;
  chevron?: boolean;
};

export function ListRightText(props: ListRightTextParams) {
  const { text, cut, chevron } = props;
  if (!text) {
    return null;
  }

  const textFormatted =
    text.length > 10 && cut ? `${text.slice(0, 10)}...` : text;

  return (
    <div className={"text-hint text-base flex gap-1 items-center"}>
      {textFormatted}
      {chevron && <ChevronIcon direction={"right"} />}
    </div>
  );
}
