import { CardNumber } from "../../ui/card-number.tsx";
import { reset } from "../../ui/reset.ts";
import { List } from "../../ui/list.tsx";
import { Flex } from "../../ui/flex.tsx";
import { cn } from "../../ui/cn.ts";
import { EyeIcon, TrashIcon } from "lucide-react";

export function ListStoryMultipleIcons() {
  return (
    <List
      animateTap={false}
      items={Array(3)
        .fill(null)
        .map((_, i) => ({
          text: (
            <div>
              <div>
                <CardNumber number={i + 1} />
                Test title
              </div>
              <div className="text-hint text-sm">
                Test description Test description Test description Test
                description Test description
              </div>
            </div>
          ),
          right: (
            <Flex gap={8}>
              <button
                className={cn(reset.button, "text-base")}
                onClick={() => {}}
              >
                <EyeIcon size={24} className="text-button" />
              </button>
              <button
                className={cn(reset.button, "text-base")}
                onClick={() => {}}
              >
                <TrashIcon size={24} className="text-danger" />
              </button>
            </Flex>
          ),
        }))}
    />
  );
}
