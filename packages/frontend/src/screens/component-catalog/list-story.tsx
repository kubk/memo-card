import { CardNumber } from "../../ui/card-number.tsx";
import { reset } from "../../ui/reset.ts";
import { List } from "../../ui/list.tsx";
import { ProIcon } from "../../ui/pro-icon.tsx";
import { cn } from "../../ui/cn.ts";
import { TrashIcon } from "lucide-react";

export function ListStory() {
  const items = Array(3)
    .fill(null)
    .map((_, i) => ({
      text: (
        <div>
          <div>
            <CardNumber number={i + 1} />
            Test title
          </div>
          <div className="text-hint text-sm">
            Test description Test description Test description Test description
            Test description
          </div>
        </div>
      ),
      right: (
        <button className={cn(reset.button, "text-base")} onClick={() => {}}>
          <TrashIcon size={24} className="text-danger" />
        </button>
      ),
    }));

  items.push({
    text: <>Test</>,
    right: <ProIcon />,
  });

  return (
    <>
      <List animateTap={false} items={items} />
    </>
  );
}
