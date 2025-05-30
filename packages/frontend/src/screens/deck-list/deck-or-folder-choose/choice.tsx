import { cn } from "../../../ui/cn.ts";
import { theme } from "../../../ui/theme.tsx";
import { Flex } from "../../../ui/flex.tsx";
import { ChevronIcon } from "../../../ui/chevron-icon.tsx";
import { ReactNode, useMemo } from "react";
import { colord } from "colord";

type Props = {
  icon?: string | ReactNode;
  title: string;
  description?: string;
  onClick: () => void;
};

export function Choice(props: Props) {
  const { icon, title, description, onClick } = props;
  const mainColor = theme.buttonColorComputed;
  const parsedColor = useMemo(() => colord(mainColor), [mainColor]);
  const bgColorWithOpacity = parsedColor.alpha(0.2).toHex();

  return (
    <div
      onClick={onClick}
      className="p-[14px_16px] flex flex-col gap-1 text-text rounded-[12px] shadow cursor-pointer"
      style={{ backgroundColor: bgColorWithOpacity }}
    >
      <Flex
        justifyContent={"space-between"}
        alignItems={"center"}
        fullWidth
        gap={12}
      >
        <Flex gap={12}>
          {typeof icon === "string" ? (
            <i className={cn(icon, "text-button")} />
          ) : (
            icon
          )}
          <Flex direction={"column"}>
            <h3 className="text-button">{title}</h3>
            <div className="text-button">{description}</div>
          </Flex>
        </Flex>
        <div className="text-button">
          <ChevronIcon direction={"right"} />
        </div>
      </Flex>
    </div>
  );
}
