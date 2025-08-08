import { Flex } from "../../../ui/flex.tsx";
import { ChevronIcon } from "../../../ui/chevron-icon.tsx";
import { ReactNode } from "react";

type Props = {
  icon?: string | ReactNode;
  title: string;
  description?: string;
  onClick: () => void;
};

export function Choice(props: Props) {
  const { icon, title, description, onClick } = props;

  return (
    <div
      onClick={onClick}
      className="p-[14px_16px] flex flex-col gap-1 bg-secondary-bg rounded-[12px] shadow cursor-pointer"
    >
      <Flex
        justifyContent={"space-between"}
        alignItems={"center"}
        fullWidth
        gap={12}
      >
        <Flex gap={16}>
          {typeof icon === "string" ? (
            <span className="text-text text-2xl">{icon}</span>
          ) : (
            icon
          )}
          <Flex direction={"column"}>
            <h3 className="text-text font-medium">{title}</h3>
            <div className="text-hint text-sm">{description}</div>
          </Flex>
        </Flex>
        <div className="text-hint">
          <ChevronIcon size={20} direction={"right"} />
        </div>
      </Flex>
    </div>
  );
}
